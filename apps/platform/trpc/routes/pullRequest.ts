import { decryptString, encryptString } from "@47ng/cloak";
import Project from "@/models/projects";
import { getNextPrId } from "@/models/pullRequest";
import { createRouter, withAuth } from "@/trpc/router";
import { DescriptionProps } from "@headlessui/react/dist/components/description/description";
import { PullRequestStatus, Secret } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import OpenPGP from "@/lib/encryption/openpgp";

export const pullRequest = createRouter({
  getAll: withAuth
    .input(z.object({ projectId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.pullRequest.findMany({
        include: {
          createdBy: true,
        },
        where: {
          projectId: input.projectId,
        },
      });
    }),
  create: withAuth
    .input(
      z.object({
        pullRequest: z.object({
          title: z.string(),
          projectSlug: z.string(),
          baseBranchId: z.string(),
          currentBranchId: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { user } = ctx.session;
      const { pullRequest } = input;

      const project = await Project.findBySlug(pullRequest.projectSlug);

      const projectId = project.id;
      const userId = user.id as string;

      const prId = await getNextPrId(projectId);

      const pr = await prisma.pullRequest.create({
        data: {
          title: pullRequest.title,
          prId,
          status: "open",
          projectId: projectId,
          createdById: userId,
          baseBranchId: pullRequest.baseBranchId,
          currentBranchId: pullRequest.currentBranchId,
        },
        include: {
          project: true,
        },
      });

      return pr;
    }),
  close: withAuth
    .input(
      z.object({
        prId: z.number(),
        projectId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { user } = ctx.session;
      const { prId, projectId } = input;

      const userId = user.id as string;

      try {
        await prisma.pullRequest.update({
          where: {
            prId_projectId: {
              projectId,
              prId,
            },
          },
          data: {
            status: PullRequestStatus.closed,
            closedAt: new Date(),
            closedById: userId,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to close this Pull Request",
        });
      }
    }),
  merge: withAuth
    .input(
      z.object({
        prId: z.number(),
        projectId: z.string(),
        baseBranchId: z.string(),
        currentBranchId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { user } = ctx.session;
      const { prId, projectId, baseBranchId, currentBranchId } = input;

      const userId = user.id as string;

      const privateKey = user.privateKey as string;

      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { encryptedProjectKey: true },
      });

      if (!(privateKey && project && project.encryptedProjectKey?.encryptedKey))
        return;
      const _encryptedProjectKey = project.encryptedProjectKey.encryptedKey;

      try {
        const _decryptedProjectKey = (await OpenPGP.decrypt(
          _encryptedProjectKey,
          privateKey,
        )) as string;

        const [currentBranchSecrets, baseBranchSecrets] = await Promise.all([
          prisma.secret.findMany({
            where: {
              branchId: currentBranchId,
              userId,
            },
          }),
          prisma.secret.findMany({
            where: {
              branchId: baseBranchId,
              userId,
            },
          }),
        ]);

        interface DecryptedSecret extends Secret {
          decryptedKey: string;
          decryptedValue: string;
        }

        const currentBranchSecretsDecrypted: DecryptedSecret[] = [];

        const baseBranchSecretsDecrypted: DecryptedSecret[] = [];

        // Decrypt the environment variables and keys for the current branch
        for (const secret of currentBranchSecrets) {
          const decryptedKey = await decryptString(
            secret.encryptedKey,
            _decryptedProjectKey,
          );
          const decryptedValue = await decryptString(
            secret.encryptedValue,
            _decryptedProjectKey,
          );
          currentBranchSecretsDecrypted.push({
            ...secret,
            decryptedKey,
            decryptedValue,
          });
        }

        // Decrypt the environment variables and keys for the main or base branch
        for (const secret of baseBranchSecrets) {
          const decryptedKey = await decryptString(
            secret.encryptedKey,
            _decryptedProjectKey,
          );
          const decryptedValue = await decryptString(
            secret.encryptedValue,
            _decryptedProjectKey,
          );
          baseBranchSecretsDecrypted.push({
            ...secret,
            decryptedKey,
            decryptedValue,
          });
        }

        // Merge the environment variables from the current branch with the environment variables from the main or base branch
        const mergedEnv: Secret[] = [];

        // Create a new object where each property key is the decryptedKey value, and the value is the corresponding secret object
        const mergedEnvMap = {
          ...baseBranchSecretsDecrypted.reduce(
            (acc, secret) => ({ ...acc, [secret.decryptedKey]: secret }),
            {} as { [key: string]: DecryptedSecret },
          ),
          ...currentBranchSecretsDecrypted.reduce(
            (acc, secret) => ({ ...acc, [secret.decryptedKey]: secret }),
            {} as { [key: string]: DecryptedSecret },
          ),
        };

        // Iterate through the currentBranchSecretsDecrypted array and add or update the secrets in the mergedEnvMap object based on the decryptedKey property
        for (const secret of currentBranchSecretsDecrypted) {
          mergedEnvMap[secret.decryptedKey] = secret;
        }

        // Convert the mergedEnvMap object back into an array of secrets
        for (const { decryptedKey, decryptedValue, ...secret } of Object.values(
          mergedEnvMap,
        )) {
          const encryptedKey = await encryptString(
            decryptedKey,
            _decryptedProjectKey,
          );
          const encryptedValue = await encryptString(
            decryptedValue,
            _decryptedProjectKey,
          );
          mergedEnv.push({
            ...secret,
            encryptedKey,
            encryptedValue,
            updatedAt: new Date(),
          });
        }

        /* await prisma.secret.updateMany({
          data: secrets,
        }); */

        // Prisma has no upsert many, this is one recomended approach
        // see https://github.com/prisma/prisma/discussions/7547

        await prisma.$transaction(
          mergedEnv
            .filter((secret) => secret.branchId === baseBranchId)
            .map((secret) =>
              prisma.secret.upsert({
                where: { uuid: secret.uuid },
                update: {
                  encryptedKey: secret.encryptedKey,
                  encryptedValue: secret.encryptedValue,
                  updatedAt: secret.updatedAt,
                },
                create: secret,
              }),
            ),
        );

        await prisma.pullRequest.update({
          where: {
            prId_projectId: {
              projectId,
              prId,
            },
          },
          data: {
            status: PullRequestStatus.merged,
            closedAt: new Date(),
            closedById: userId,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to close this Pull Request",
        });
      }
    }),
});
