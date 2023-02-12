import { createRouter, withAuth } from "@/trpc/router";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import Audit from "@/lib/audit";

export const branches = createRouter({
  getAll: withAuth.query(({ ctx }) => {
    // return ctx.prisma.projects.findMany();
    return [];
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
        branch: z.object({ name: z.string(), projectId: z.string() }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { user } = ctx.session;
      const { branch } = input;

      const accessCount = await prisma.access.count({
        where: {
          projectId: branch.projectId,
        },
      });

      if (accessCount <= 0) {
        return new TRPCError({
          code: "BAD_REQUEST",
          message: "You do not have permission to create branch"
        });
      }

      const newBranch = await prisma.branch.create({
        data: {
          name: branch.name,
          projectId: branch.projectId,
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
