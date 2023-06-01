import SecurityAlert from "@/emails/SecurityAlert";
import BulletedList from "@/emails/components/BulletedList";
import SessionHistory from "@/models/SessionHistory";
import { accessesWithProject } from "@/models/access";
import { sendVerificationEmail } from "@/models/user";
import { createRouter, withAuth, withoutAuth } from "@/trpc/router";
import { formatDateTime } from "@/utils/helpers";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import argon2 from "argon2";
import sendMail from "emails";
import { z } from "zod";
import { getClientDetails } from "@/lib/client";
import log from "@/lib/log";
import prisma from "@/lib/prisma";

export const auth = createRouter({
  signup: withoutAuth
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name, email } = input;

      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (existingUser) {
        if (!existingUser.emailVerified) {
          return await sendVerificationEmail(existingUser);
        } else {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You may already have an account, please try logging in.",
          });
        }
      }

      try {
        const user = await prisma.user.create({
          data: { name, email },
        });

        return await sendVerificationEmail(user);
      } catch (error) {
        if (error.code === "P2002") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You may already have an account, please try logging in.",
          });
        } else {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Something went wrong, please refresh and try again.",
          });
        }
      }
    }),

  password: withAuth
    .input(
      z.object({
        publicKey: z.string(),
        hashedPassword: z.string(),
        encryptedPrivateKey: z.object({
          iv: z.string(),
          tag: z.string(),
          ciphertext: z.string(),
        }),
        revocationCertificate: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const {
        publicKey,
        hashedPassword,
        encryptedPrivateKey,
        revocationCertificate,
      } = input;

      const { user } = ctx.session;

      const updatePassword = async () => {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: { hashedPassword },
        });

        return true;
      };

      const updateKeychain = async () => {
        const keychain = await prisma.keychain.upsert({
          where: {
            userId: user.id,
          },

          update: {
            publicKey,
            encryptedPrivateKey,
            revocationCertificate,
            temp: false,
          },

          create: {
            userId: user.id,
            publicKey,
            encryptedPrivateKey,
            revocationCertificate,
            temp: false,
          },

          select: {
            temp: true,
            encryptedPrivateKey: true,
          },
        });

        return keychain;
      };

      // const encryptProjectKeys = async (userId: string) => {
      //   const accesses = await accessesWithProject({ userId });

      //   accesses.map((access) => {
      //     const { project } = access;
      //     // Encrypt project keys
      //   });
      // };

      const hasMasterPassword = await updatePassword();
      const keychain = await updateKeychain();
      // await encryptProjectKeys(user.id);

      return { hasMasterPassword, keychain };
    }),

  verifyPassword: withAuth
    .input(
      z.object({
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { password } = input;
      const { user } = ctx.session;

      const existingUser = await prisma.user.findUnique({
        where: {
          id: user.id,
        },

        select: {
          hashedPassword: true,
        },
      });

      if (!existingUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Something went wrong, please refresh and try again.",
        });
      }

      const { hashedPassword } = existingUser;

      if (!hashedPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Something went wrong, please refresh and try again.",
        });
      }

      const valid = await argon2.verify(hashedPassword, password);

      console.log(`Password is valid: ${valid}`);

      if (!valid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please check your password and try again.",
        });
      }

      return true;
    }),

  verify: withAuth
    .input(
      z.object({
        sessionId: z.string(),
        fingerprint: z.string(),
        name: z.string().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { req } = ctx;
      const { user } = ctx.session;
      const { fingerprint, sessionId, name } = input;

      if (sessionId !== ctx.session.id) {
        return new TRPCError({
          code: "BAD_REQUEST",
          message: "Session ID does not match.",
        });
      }

      const client = await getClientDetails(req);
      const sessionHistory = await SessionHistory.getOne(sessionId);

      if (sessionHistory && !sessionHistory?.fingerprint) {
        const { ip, os, isBot, browser, device, engine, cpu, geo } = client;

        await SessionHistory.update(sessionId, {
          ip,
          os,
          cpu,
          geo,
          device,
          engine,
          browser,
          fingerprint,
          isBot: isBot || false,
        });

        const previousSession = await SessionHistory.previous(
          sessionId,
          user.id,
          fingerprint,
        );

        if (!previousSession) {
          log("Logging in for the first time on this device");

          sendMail({
            subject: "Envless security alert: New sign-in",
            to: user.email,
            component: (
              <SecurityAlert
                headline="Envless Security Alert: New Sign-In"
                name={"there"}
                body={
                  <>
                    We noticed a new sign-in to your Envless account on a{" "}
                    {os.name} device. If this was you, you don{"'"}t need to do
                    anything. If not, please reply to this email and we{"'"}ll
                    help you secure your account.
                  </>
                }
                bulletedList={
                  <BulletedList
                    items={[
                      `Device: ${os.name} ${os.version}`,
                      `Browser: ${browser.name} ${browser.version}`,
                      `Location: ${geo?.city}, ${geo?.region}`,
                      `IP Address: ${ip}`,
                      `Date: ${formatDateTime(sessionHistory.createdAt)}`,
                    ]}
                  />
                }
              />
            ),
          });
        }

        const currentUser = await prisma.user.findUnique({
          where: {
            id: user.id,
          },
          select: {
            id: true,
            name: true,
            email: true,
          },
        });

        if (!currentUser?.name) {
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              name,
            },
          });
        }
      }

      return sessionHistory;
    }),
});
