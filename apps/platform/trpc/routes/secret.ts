import { createRouter, withAuth } from "@/trpc/router";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export const secrets = createRouter({
  getSecretesByBranchId: withAuth
    .input(
      z.object({
        branchId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { branchId } = input;
      const { user } = ctx.session;

      const branch = await ctx.prisma.branch.findUnique({
        where: {
          id: branchId,
        },

        select: {
          id: true,
          name: true,
          project: {
            select: {
              id: true,
              name: true,
              encryptedProjectKey: {
                select: {
                  encryptedKey: true,
                },
              },
            },
          },
        },
      });

      const secrets = await ctx.prisma.secret.findMany({
        where: {
          branchId,
          userId: user.id,
        },
        select: {
          id: true,
          encryptedKey: true,
          encryptedValue: true,
        },
      });

      return {
        branch,
        secrets,
      };
    }),
  saveSecrets: withAuth
    .input(
      z.object({
        secrets: z.array(
          z.object({
            id: z.string().nullable(),
            encryptedKey: z.string().min(1),
            encryptedValue: z.string().min(1),
            branchId: z.string().min(1),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { user } = ctx.session;
      const { secrets } = input;

      const branchId = secrets[0].branchId;

      const latestVersionOfSecret = (await prisma.$queryRaw(
        Prisma.sql`SELECT id, version FROM "Secret"
           where version = (SELECT MAX(version) FROM "Secret") 
           and "branchId" = ${branchId}
           limit 1`,
      )) as [{ id: string; version: number }];
      let newVersion = 1;

      if (latestVersionOfSecret.length > 0) {
        newVersion =
          latestVersionOfSecret[0].version === 0
            ? newVersion
            : latestVersionOfSecret[0].version + 1;
      }

      // this may not be used
      ctx.prisma.$use(async (params, next) => {
        if (params.model == "Secret" && params.action == "create") {
        }

        return next(params);
      });

      const secretsToInsert = secrets
        .filter((secret) => !secret.id)
        .map((secret) => ({
          encryptedKey: secret.encryptedKey,
          encryptedValue: secret.encryptedValue,
          userId: user?.id,
          branchId: secret.branchId,
        }));

      const secretsToUpdate = secrets
        .filter((secret) => secret.id)
        .map((secret) => ({
          id: secret.id,
          encryptedKey: secret.encryptedKey,
          encryptedValue: secret.encryptedValue,
          branchId: secret.branchId,
        }));

      try {
        if (secretsToInsert.length > 0) {
          await prisma.secret.createMany({
            data: secretsToInsert as never,
          });

          for (let secret of secretsToInsert) {
            await prisma.secret.create({
              data: {
                encryptedKey: secret.encryptedKey as string,
                encryptedValue: secret.encryptedValue as string,
                branchId: secret.branchId,
                version: newVersion,
                originalId: null, // this will change
                userId: user.id,
              },
            });
          }
        }

        if (secretsToUpdate && secretsToUpdate.length > 0) {
          for (let secret of secretsToUpdate) {
            await prisma.secret.update({
              data: {
                encryptedKey: secret?.encryptedKey,
                encryptedValue: secret?.encryptedValue,
                branchId: secret?.branchId,
              },
              where: {
                id: secret?.id || undefined,
              },
            });
          }
        }
      } catch (err) {
        throw new Error(err.message);
      }
    }),
});
