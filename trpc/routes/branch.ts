import { createRouter, withAuth } from "@/trpc/router";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import Audit from "@/lib/audit";

export const branches = createRouter({
  getAll: withAuth
    .input(z.object({ projectId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.branch.findMany({
        include: {
          createdBy: true,
        },
        where: {
          projectId: input.projectId,
        },
      });
    }),

  getOne: withAuth
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
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
          projectId: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { user } = ctx.session;
      const { branch } = input;

      const projectId = branch.projectId as string;
      const userId = user.id as string;

      const projectAccess = await prisma.access.findUnique({
        where: {
          userId_projectId: {
            userId,
            projectId,
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
            projectId: projectId,
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
          projectId: branch.projectId,
          createdById: userId,
        },
      });

      if (newBranch.id) {
        await Audit.create({
          createdById: user.id,
          projectId: branch.projectId,
          action: "created.branch",
          data: {
            branch: {
              id: newBranch.id,
              name: newBranch.name,
            },
          },
        });
      }

      return newBranch;
    }),
});
