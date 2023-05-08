import { createRouter, withAuth } from "@/trpc/router";
import { z } from "zod";

export const pullRequestHistory = createRouter({
  getAllPrHistoryByBranchId: withAuth
    .input(
      z.object({
        branchId: z.string(),
        branchType: z.string(),
        pullRequestId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { branchType, branchId, pullRequestId } = input;
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

      const pullRequestHistories = await ctx.prisma.pullRequestHistory.findMany(
        {
          where: {
            pullRequestId,
            ...(branchType === "current"
              ? { currentBranchId: branchId }
              : { baseBranchId: branchId }),
          },
        },
      );

      return {
        branch,
        pullRequestHistories,
      };
    }),
});
