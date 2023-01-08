import { z } from "zod";
import { authenticator } from "otplib";
import { Decrypted } from "@/lib/crypto";
import { createRouter, withAuth, throwError } from "@/trpc/router";

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

      prisma.user
        .findUnique({
          where: {
            // @ts-ignore
            id: user.id,
          },
          select: {
            twoFactorSecret: true,
          },
        })
        .then((u) => {
          if (!u) {
            return throwError("NOT_FOUND", "User not found");
          }

          if (!u.twoFactorSecret) {
            return throwError(
              "BAD_REQUEST",
              "User does not have a two factor secret",
            );
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
            return throwError("BAD_REQUEST", "Invalid code");
          } else {
            return prisma.user.update({
              where: {
                // @ts-ignore
                id: user.id,
              },
              data: {
                twoFactorEnabled: true,
              },
            });
          }
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
