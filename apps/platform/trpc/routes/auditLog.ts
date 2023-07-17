import { createRouter, withAuth } from "@/trpc/router";
import { z } from "zod";

export const auditLogs = createRouter({
  getAll: withAuth
    .input(
      z.object({
        pageIndex: z.number(),
        pageSize: z.number(),
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const auditLogs = await ctx.prisma.audit.findMany({
        where: {
          projectId: input.projectId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          project: {
            select: {
              name: true,
            },
          },
          createdBy: {
            select: {
              name: true,
            },
          },
        },
        take: input.pageSize,
        skip: input.pageIndex * input.pageSize,
      });

      return auditLogs;
    }),
});
