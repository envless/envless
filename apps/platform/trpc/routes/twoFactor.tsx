import { Fragment } from "react";
import InviteLink from "@/emails/InviteLink";
import LockUserAccount from "@/emails/LockUserAccount";
import { env } from "@/env/index.mjs";
import { lockUserAccountAndSendEmail } from "@/models/user";
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
          failedAuthAttempts: true,
          locked: true,
        },
      });

      if (!userRecord) {
        return new TRPCError({
          code: "NOT_FOUND",
          message:
            "Something went wrong, our engineers are aware of it and are working on a fix.",
        });
      }

      if (userRecord.locked) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Your account has been locked. Please contact support for assistance.",
        });
      }

      if (userRecord.failedAuthAttempts >= env.MAX_AUTH_ATTEMPTS) {
        await lockUserAccountAndSendEmail({
          user,
          reason: "Too many failed two-factor authentication attempts",
          emailSubject: "Your Account Has Been Locked for Security Reasons",
          emailTemplate: (
            <LockUserAccount
              headline={<Fragment>Your account has been locked</Fragment>}
              greeting={`Hi ${user.name || "there"},`}
              body={
                <Fragment>
                  We regret to inform you that your account has been locked due
                  to repeated failed authentication attempts.
                  <br />
                  <br />
                  To unlock your account, please contact our support team at
                  support@envless.dev.
                </Fragment>
              }
            />
          ),
        });

        // Throw an error to indicate that the user account is locked
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Your account has been locked. Please contact support for assistance.",
        });
      }

      const isValid = await verifyTwoFactor({
        code,
        secret: userRecord.encryptedTwoFactorSecret,
      });

      if (!isValid) {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            failedAuthAttempts: userRecord.failedAuthAttempts + 1,
          },
        });

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Invalid code. ${
            env.MAX_AUTH_ATTEMPTS - userRecord.failedAuthAttempts
          } attempts left.`,
        });
      }

      // Reset the failedAuthAttempts count
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          failedAuthAttempts: 0,
        },
      });

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
