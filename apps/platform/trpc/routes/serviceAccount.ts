import { createRouter, withAuth } from "@/trpc/router";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const serviceAccount = createRouter({
  getOne: withAuth.query(async ({ ctx }) => {
    const { prisma } = ctx;
    const { user } = ctx.session;

    const serviceAccount = await prisma.serviceAccount.findUnique({
      where: {
        userId: user.id,
      },
    });

    return { serviceAccount };
  }),

  create: withAuth
    .input(
      z.object({
        hashedToken: z.string().trim(),
        integration: z.string().trim(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { user } = ctx.session;
      const { hashedToken, integration } = input;

      const serviceAccount = await prisma.serviceAccount.create({
        data: {
          userId: user.id,
          integration,
          hashedToken,
        },
      });

      return { serviceAccount };
    }),

  update: withAuth
    .input(
      z.object({
        active: z.boolean().optional(),
        hashedToken: z.string().trim().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { user } = ctx.session;
      const { active, hashedToken } = input;

      if (!active && !hashedToken) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Bad request, there is no data to update",
        });
      }

      const serviceAccount = await prisma.serviceAccount.update({
        where: {
          userId: user.id,
        },
        data: {
          active,
          hashedToken,
        },
      });

      return { serviceAccount };
    }),
});
