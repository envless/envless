import { createRouter, withAuth } from "@/trpc/router";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const cli = createRouter({
  getOne: withAuth.query(async ({ ctx }) => {
    const { prisma } = ctx;
    const { user } = ctx.session;

    const cli = await prisma.cli.findUnique({
      where: {
        userId: user.id,
      },
    });

    return { cli };
  }),

  create: withAuth
    .input(
      z.object({
        hashedToken: z.string().trim(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { user } = ctx.session;
      const { hashedToken } = input;

      const cli = await prisma.cli.create({
        data: {
          userId: user.id,
          hashedToken,
        },
      });

      return { cli };
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

      const cli = await prisma.cli.update({
        where: {
          userId: user.id,
        },
        data: {
          active,
          hashedToken,
        },
      });

      return { cli };
    }),
});
