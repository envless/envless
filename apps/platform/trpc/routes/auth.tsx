import MagicLink from "@/emails/MagicLink";
import SecurityAlert from "@/emails/SecurityAlert";
import BulletedList from "@/emails/components/BulletedList";
import SessionHistory from "@/models/SessionHistory";
import { createRouter, withAuth, withoutAuth } from "@/trpc/router";
import { formatDateTime } from "@/utils/helpers";
import { TRPCError } from "@trpc/server";
import { createHash, randomBytes } from "crypto";
import sendMail from "emails";
import { z } from "zod";
import { getClientDetails } from "@/lib/client";
import log from "@/lib/log";
import prisma from "@/lib/prisma";

const hashToken = (token: string) => {
  return createHash("sha256")
    .update(`${token}${process.env.NEXTAUTH_SECRET}`)
    .digest("hex");
};

export const auth = createRouter({
  signup: withoutAuth
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        hashedPassword: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let user;
      const { name, email, hashedPassword } = input;
      console.log("signup", input);

      try {
        user = await prisma.user.create({
          data: {
            name,
            email,
            hashedPassword,
          },
        });

        const firstName = name.split(" ")[0];
        const token = randomBytes(32).toString("hex");
        const TWENTY_FOUR_HOURS_IN_SECONDS = 60 * 60 * 24;
        const expires = new Date(
          Date.now() + TWENTY_FOUR_HOURS_IN_SECONDS * 1000,
        );

        await prisma.verificationToken.create({
          data: {
            identifier: email,
            token: hashToken(token),
            expires,
          },
        });

        const params = new URLSearchParams({
          callbackUrl: `${process.env.NEXTAUTH_URL}/projects`,
          email,
          token,
        });

        const url = `${process.env.NEXTAUTH_URL}/api/auth/callback/email?${params}`;

        sendMail({
          subject: "Complete your Envless signup",
          to: email,
          component: (
            <MagicLink
              headline="Complete your Envless signup"
              greeting={`Hi ${firstName || "there"},`}
              body={
                <>
                  Welcome to Envless! Please click the button below to complete
                  the signup process.
                </>
              }
              subText="If you did not signup for Envless, your account is not compromised and its safe to ignore it."
              buttonText={"Verify your email address"}
              buttonLink={url}
            />
          ),
        });

        return user;
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

  verifyBrowser: withAuth
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
