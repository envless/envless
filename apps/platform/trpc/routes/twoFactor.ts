import { createRouter, withAuth } from "@/trpc/router";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import redis from "@/lib/redis";
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
      const { id, user } = ctx.session; // id is the session id
      const { code } = input;

      const userRecord = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          encryptedTwoFactorSecret: true,
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
        secret: userRecord.encryptedTwoFactorSecret,
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
          id: user.id,
        },
        data: {
          twoFactorEnabled: true,
        },
      });
    }),

  disable: withAuth.mutation(async ({ ctx, input }) => {
    const { prisma } = ctx;
    const { user } = ctx.session;

    return await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        encryptedTwoFactorSecret: {},
        twoFactorEnabled: false,
      },
    });
  }),

  verify: withAuth
    .input(
      z.object({
        code: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { code } = input;
      const { id, user } = ctx.session; // id is the session id

      const userRecord = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          encryptedTwoFactorSecret: true,
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
        secret: userRecord.encryptedTwoFactorSecret,
      });

      if (!isValid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Code is either expired or invalid. Please copy code from authenticator app and try again.",
        });
      }

      const sessionStore = await redis.get(`session:${id}`);

      if (!sessionStore) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Something went wrong, our engineers are aware of it and are working on a fix.",
        });
      }

      await redis.set(
        `session:${id}`,
        {
          ...sessionStore,
          mfa: true,
        },
        { ex: 60 * 60 * 24 * 7 }, // 7 days
      );

      return {
        valid: isValid,
      };
    }),
});
