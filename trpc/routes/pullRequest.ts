import { createRouter, withAuth } from "@/trpc/router";
import { z } from "zod";

export const pullRequest = createRouter({
  create: withAuth
    .input(
      z.object({
        pullRequest: z.object({
          title: z.string(),
          projectId: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { user } = ctx.session;
      const { pullRequest } = input;

      const projectId = pullRequest.projectId as string;
      const userId = user.id as string;

      const pr = await prisma.pullRequest.create({
        data: {
          title: pullRequest.title,
          prId: "123",
          status: "open",
          projectId: projectId,
          createdById: userId,
        },
      });

      return pr;
    }),
});
