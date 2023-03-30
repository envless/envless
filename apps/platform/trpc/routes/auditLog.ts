import { createRouter, withAuth } from "@/trpc/router";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import Audit from "@/lib/audit";

export const auditLogs = createRouter({
  getAll: withAuth
    .input(z.object({ page: z.number() }))
    .query(async ({ ctx, input }) => {
      const ITEMS_PER_PAGE = 25;

      const auditLogs = await ctx.prisma.audit.findMany({
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
        take: ITEMS_PER_PAGE,
        skip: (input.page - 1) * ITEMS_PER_PAGE,
      });

      return auditLogs;
    }),
});
