import Project from "@/models/projects";
import { getNextPrId } from "@/models/pullRequest";
import { createRouter, withAuth } from "@/trpc/router";
import { z } from "zod";

export const pullRequest = createRouter({
  getAll: withAuth
    .input(z.object({ projectId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.pullRequest.findMany({
        include: {
          createdBy: true,
        },
        where: {
          projectId: input.projectId,
        },
      });
    }),
  create: withAuth
    .input(
      z.object({
        pullRequest: z.object({
          title: z.string(),
          projectSlug: z.string(),
          baseBranchId: z.string(),
          currentBranchId: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { user } = ctx.session;
      const { pullRequest } = input;

      const project = await Project.findBySlug(pullRequest.projectSlug);

      const projectId = project.id;
      const userId = user.id as string;

      const prId = await getNextPrId(projectId);

      const pr = await prisma.pullRequest.create({
        data: {
          title: pullRequest.title,
          prId,
          status: "open",
          projectId: projectId,
          createdById: userId,
          baseBranchId: pullRequest.baseBranchId,
          currentBranchId: pullRequest.currentBranchId,
        },
        include: {
          project: true,
        },
      });

      return pr;
    }),
});
