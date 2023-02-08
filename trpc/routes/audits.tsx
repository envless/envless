import { createRouter, withAuth } from "@/trpc/router";
import { z } from "zod";
import Audit from "@/lib/audit";

export const audits = createRouter({
  paginate: withAuth
    .input(
      z.object({
        limit: z.number().min(1).nullish(),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;
      const { cursor } = input;

      const access = await prisma?.access.findMany({
        where: { userId: ctx.session.user.id },
        select: { projectId: true },
      });

      const projectIds = access?.map((e) => e.projectId);

      const logs = await Audit.logs({
        createdById: ctx.session.user.id,
        actions: ["updated.account"],
        projectIds: projectIds,
        limit: limit + 1,
        cursor,
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (logs.length > limit) {
        const nextItem = logs.pop();
        nextCursor = nextItem?.id;
      }

      return {
        logs,
        nextCursor,
      };
    }),
});
