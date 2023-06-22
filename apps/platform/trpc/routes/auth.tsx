import SecurityAlert from "@/emails/SecurityAlert";
import BulletedList from "@/emails/components/BulletedList";
import SessionHistory from "@/models/SessionHistory";
import { sendVerificationEmail } from "@/models/user";
import { createRouter, withAuth, withoutAuth } from "@/trpc/router";
import { formatDateTime } from "@/utils/helpers";
import { TRPCError } from "@trpc/server";
import sendMail from "emails";
import { z } from "zod";
import { getClientDetails } from "@/lib/client";
import prisma from "@/lib/prisma";

const debug = require("debug")("envless:trpc");

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
      const lowercaseEmail = email.toLowerCase();

      const currentUser = await prisma.user.findUnique({
        where: {
          email: lowercaseEmail,
        },
      });

      if (currentUser) {
        if (!currentUser.emailVerified) {
          return await sendVerificationEmail(currentUser);
        } else {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You may already have an account, please try logging in.",
          });
        }
      }

      try {
        const user = await prisma.user.create({
          data: { name, email: lowercaseEmail },
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

  keychain: withAuth
    .input(
      z.object({
        publicKey: z.string(),
        verificationString: z.string(),
        revocationCertificate: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;
      const { publicKey, verificationString, revocationCertificate } = input;

      const keychain = await prisma.keychain.create({
        data: {
          publicKey,
          verificationString,
          revocationCertificate,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return keychain;
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
          debug("Logging in for the first time on this device");

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

        if (name && !currentUser?.name) {
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
