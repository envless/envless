import Project from "@/models/projects";
import { createRouter, withAuth } from "@/trpc/router";
import { BRANCH_CREATED } from "@/types/auditActions";
import { UserRole } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import Audit from "@/lib/audit";

export const branches = createRouter({
  getAll: withAuth
    .input(z.object({ projectId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.branch.findMany({
        include: {
          createdBy: true,
          project: true,
        },
        where: {
          projectId: input.projectId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
  getOne: withAuth.input(z.object({ id: z.number() })).query(({ input }) => {
    const { id } = input;

    return { id };
  }),
  create: withAuth
    .input(
      z.object({
        branch: z.object({
          name: z
            .string()
            .min(2)
            .regex(
              /^[a-z0-9][a-z0-9-]{0,}[a-z0-9]$/,
              "Name can only contain lowercase alphanumeric characters and dashes, cannot start or end with a dash, and must be at least two characters.",
            ),
          projectSlug: z.string(),
          baseBranchId: z
            .string()
            .min(1, { message: "Base Branch is required" }),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { user } = ctx.session;
      const { branch } = input;

      const projectSlug = branch.projectSlug as string;

      const project = await Project.findBySlug(projectSlug);

      const userId = user.id as string;

      const projectAccess = await prisma.access.findUnique({
        where: {
          userId_projectId: {
            userId,
            projectId: project.id,
          },
        },
        select: {
          id: true,
        },
      });

      if (!projectAccess) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You do not have permission to create a branch",
        });
      }

      const existingBranch = await prisma.branch.findUnique({
        where: {
          name_projectId: {
            name: branch.name,
            projectId: project.id,
          },
        },
      });

      if (existingBranch) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Branch name already exists",
        });
      }

      const newBranch = await prisma.branch.create({
        data: {
          name: branch.name,
          projectId: project.id,
          createdById: userId,
        },
      });

      if (newBranch.id) {
        await Audit.create({
          createdById: user.id,
          projectId: project.id,
          action: BRANCH_CREATED,
          data: {
            branch: {
              id: newBranch.id,
              name: newBranch.name,
            },
          },
        });
      }

      const baseBranch = await prisma.branch.findUnique({
        where: {
          id: branch.baseBranchId,
        },
        include: {
          secrets: {
            select: {
              id: true,
              encryptedKey: true,
              encryptedValue: true,
            },
          },
        },
      });

      // copy over all the secrets to newly created branch
      if (baseBranch) {
        const baseBranchSecrets = baseBranch.secrets;

        if (baseBranchSecrets.length > 0) {
          for (let baseBranchSecret of baseBranchSecrets) {
            await prisma.secret.create({
              data: {
                encryptedKey: baseBranchSecret.encryptedKey,
                encryptedValue: baseBranchSecret.encryptedValue,
                branchId: newBranch.id,
                userId: user.id,
                uuid: randomUUID(),
              },
            });
          }
        }
      }

      return newBranch;
    }),
  update: withAuth
    .input(
      z.object({
        branch: z.object({
          id: z.string(),
          name: z.string(),
          description: z.string(),
          protected: z.boolean(),
          protectedAt: z.date(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { branch } = input;

      const currentBranch = await prisma.branch.findUnique({
        where: {
          id: branch.id,
        },
      });

      if (!currentBranch) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Branch does not exist",
        });
      }

      if (!branch.protected && branch.name === "main") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You can not remove protection from the main branch",
        });
      }

      const protectedAt =
        currentBranch.protectedAt || branch.protectedAt || new Date();
      const updatedBranch = await prisma.branch.update({
        where: {
          id: currentBranch.id,
        },
        data: {
          description: branch.description,
          protected: branch.protected,
          ...(branch.protected ? { protectedAt } : {}),
        },
      });

      return updatedBranch;
    }),
  delete: withAuth
    .input(z.object({ branchId: z.string(), projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { branchId, projectId } = input;

      const branch = await ctx.prisma.branch.findUnique({
        where: { id: branchId },
        select: { protected: true, name: true },
      });

      const access = await ctx.prisma.access.findUnique({
        where: {
          userId_projectId: {
            projectId,
            userId: ctx.session.user.id,
          },
        },
        select: {
          role: true,
        },
      });

      if (!access) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to delete this branch",
        });
      }

      const allowedRoles: UserRole[] = [UserRole.owner, UserRole.maintainer];

      const isAllowed = allowedRoles.includes(access.role);

      if (!isAllowed) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to delete this branch",
        });
      }

      if (!branch) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Branch does not exist",
        });
      }

      if (branch.protected) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot delete protected branches",
        });
      }

      if (branch.name === "main") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot delete the main branch",
        });
      }

      try {
        const deletedBranch = await ctx.prisma.branch.delete({
          where: {
            id: branchId,
          },
        });

        return deletedBranch;
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Branch does not exist",
        });
      }
    }),
});
