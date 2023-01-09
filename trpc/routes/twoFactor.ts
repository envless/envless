import { z } from "zod";
import { authenticator } from "otplib";
import { Decrypted } from "@/lib/crypto";
import { TRPCError } from "@trpc/server";
import { createRouter, withAuth } from "@/trpc/router";

export const twoFactor = createRouter({
  enable: withAuth
    .input(
      z.object({
        code: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { prisma } = ctx;
      const { user } = ctx.session;
      const { code } = input;

      return prisma.user
        .findUnique({
          where: {
            // @ts-ignore
            id: user.id,
          },
          select: {
            twoFactorSecret: true,
          },
        })
        // @ts-ignore
        .then((u: any) => {
          if (!u) {
            return new TRPCError({
              code: "NOT_FOUND",
              message:
                "Something went wrong, our engineers are aware of it and are working on a fix.",
            });
          }

          if (!u.twoFactorSecret) {
            return new TRPCError({
              code: "BAD_REQUEST",
              message:
                "Something went wrong, please reload this page and try again.",
            });
          }

          const decryptedSecret = Decrypted(
            u.twoFactorSecret,
            process.env.ENCRYPTION_KEY || "",
          );

          const isValid = authenticator.verify({
            token: code,
            secret: decryptedSecret,
          });

          if (!isValid) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "Code is either expired or invalid. Please copy code from authenticator app and try again.",
            });
          }

          return prisma.user.update({
            where: {
              // @ts-ignore
              id: user.id,
            },
            data: {
              twoFactorEnabled: true,
            },
          });
        });
    }),

  disable: withAuth.mutation(({ ctx, input }) => {
    const { prisma } = ctx;
    const { user } = ctx.session;

    return prisma.user.update({
      where: {
        // @ts-ignore
        id: user.id,
      },
      data: {
        twoFactorSecret: null,
        twoFactorEnabled: false,
      },
    });
  }),
});
