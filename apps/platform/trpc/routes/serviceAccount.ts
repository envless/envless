import { createRouter, withAuth } from "@/trpc/router";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const serviceAccount = createRouter({
  getOne: withAuth
    .input(
      z.object({
        projectId: z.string(),
        integration: z.string(),
        createdById: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { user } = ctx.session;
      const { projectId, integration, createdById } = input;

      const projectAccess = await ctx.prisma.access.findFirst({
        where: {
          projectId,
          status: "active",
          userId: user.id,
        },
      });

      if (!projectAccess) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to access this project",
        });
      }

      let serviceAccount;

      if (createdById) {
        serviceAccount = await prisma.serviceAccount.findUnique({
          where: {
            projectId_createdById_integration: {
              projectId,
              createdById: user.id,
              integration,
            },
          },
        });
      } else {
        serviceAccount = await prisma.serviceAccount.findUnique({
          where: {
            projectId_integration: {
              projectId,
              integration,
            },
          },
        });
      }

      return { serviceAccount };
    }),

  create: withAuth
    .input(
      z.object({
        projectId: z.string().trim(),
        hashedToken: z.string().trim(),
        integration: z.string().trim(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { user } = ctx.session;
      const { projectId, hashedToken, integration } = input;

      const projectAccess = await ctx.prisma.access.findFirst({
        where: {
          projectId,
          status: "active",
          userId: user.id,
        },
      });

      if (!projectAccess) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to access this project",
        });
      }

      const serviceAccount = await prisma.serviceAccount.create({
        data: {
          createdById: user.id,
          projectId,
          active: true,
          integration,
          hashedToken,
        },
      });

      return { serviceAccount };
    }),

  update: withAuth
    .input(
      z.object({
        id: z.string().trim(),
        active: z.boolean().optional(),
        hashedToken: z.string().trim().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { user } = ctx.session;
      const { id, active, hashedToken } = input;

      const serviceAccount = await prisma.serviceAccount.findUnique({
        where: { id },
      });

      if (!serviceAccount) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Service account not found",
        });
      }

      if (!active && !hashedToken) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Bad request, there is no data to update",
        });
      }

      const { integration, createdById, projectId } = serviceAccount;

      const projectAccess = await ctx.prisma.access.findFirst({
        where: {
          status: "active",
          userId: user.id,
          projectId,
        },
      });

      if (!projectAccess) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to access this project",
        });
      }

      if (integration === "cli" && createdById != user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to update this service account",
        });
      }

      const updatedServiceAccount = await prisma.serviceAccount.update({
        where: { id },
        data: {
          active,
          hashedToken,
        },
      });

      return { updatedServiceAccount };
    }),
});
