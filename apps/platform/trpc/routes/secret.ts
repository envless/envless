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

      const secrets = await ctx.prisma.secret.findMany({
        where: {
          branchId,
          // userId: user.id
        },
        include: {
          branch: {
            select: {
              id: true,
              name: true,
            },
            include: {
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
          },
        },
      });

      return secrets;
    }),
});
