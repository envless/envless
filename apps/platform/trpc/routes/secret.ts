import { createRouter, withAuth } from "@/trpc/router";
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
          // userId: user.id
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
});
