import Project from "@/models/projects";
import { getNextPrId } from "@/models/pullRequest";
import { createRouter, withAuth } from "@/trpc/router";
import {
  PULL_REQUEST_CLOSED,
  PULL_REQUEST_CREATED,
} from "@/types/auditActions";
import { PullRequestStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import Audit from "@/lib/audit";

export const pullRequest = createRouter({
  getAll: withAuth
    .input(z.object({ projectId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.pullRequest.findMany({
        where: {
          projectId: input.projectId,
        },
        include: {
          createdBy: true,
          baseBranch: {
            select: {
              id: true,
              name: true,
            },
          },
          currentBranch: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    }),
  create: withAuth
    .input(
      z.object({
        pullRequest: z.object({
          title: z.string(),
          projectSlug: z.string(),
          currentBranchId: z.string(),
          baseBranchId: z.string(),
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
      const { title, currentBranchId, baseBranchId } = pullRequest;

      const prId = await getNextPrId(projectId);

      const pr = await prisma.pullRequest.create({
        data: {
          title,
          prId,
          status: "open",
          currentBranchId,
          baseBranchId,
          projectId: projectId,
          createdById: userId,
        },
        include: {
          project: true,
        },
      });

      await Audit.create({
        createdById: user.id,
        projectId: pr.id,
        action: PULL_REQUEST_CREATED,
        data: {
          pullRequest: {
            id: pr.id,
            title: pr.id,
            status: pr.status,
          },
        },
      });

      return pr;
    }),
  close: withAuth
    .input(
      z.object({
        pullRequest: z.object({
          prId: z.number(),
          projectId: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { pullRequest: prInput } = input;
      const { user } = ctx.session;

      const pullRequest = await ctx.prisma.pullRequest.findUnique({
        where: {
          prId_projectId: {
            prId: prInput.prId,
            projectId: prInput.projectId,
          },
        },
      });

      if (!pullRequest) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Pull Request you are requesting to close does not exists.",
        });
      }

      if (pullRequest?.status === PullRequestStatus.closed) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Pull Request you are requesting to close has already been closed.",
        });
      }

      const updatedPr = await ctx.prisma.pullRequest.update({
        data: {
          closedById: user.id,
          closedAt: new Date(),
          status: PullRequestStatus.closed,
        },
        where: {
          id: pullRequest?.id,
        },
      });

      await Audit.create({
        createdById: user.id,
        projectId: updatedPr.projectId,
        action: PULL_REQUEST_CLOSED,
        data: {
          pullRequest: {
            id: updatedPr.id,
            title: updatedPr.title,
            closedAt: updatedPr.closedAt,
            status: updatedPr.status,
          },
        },
      });

      return updatedPr;
    }),
});
