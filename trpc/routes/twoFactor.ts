import { createRouter, withAuth } from "@/trpc/router";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { verifyTwoFactor } from "@/lib/twoFactorAuth";

export const twoFactor = createRouter({
  enable: withAuth
    .input(
      z.object({
        code: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { user } = ctx.session;
      const { code } = input;
      // @ts-ignore
      const userId = user.id;

      const userRecord = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          twoFactor: true,
        },
      });

      if (!userRecord) {
        return new TRPCError({
          code: "NOT_FOUND",
          message:
            "Something went wrong, our engineers are aware of it and are working on a fix.",
        });
      }

      const isValid = await verifyTwoFactor({
        code,
        secret: userRecord.twoFactor,
      });

      if (!isValid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Code is either expired or invalid. Please copy code from authenticator app and try again.",
        });
      }

      return await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          twoFactorEnabled: true,
        },
      });
    }),

  disable: withAuth.mutation(async ({ ctx, input }) => {
    const { prisma } = ctx;
    const { user } = ctx.session;
    // @ts-ignore
    const userId = user.id;

    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        twoFactor: {},
        twoFactorEnabled: false,
      },
    });
  }),
});
