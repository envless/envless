import SecurityAlert from "@/emails/SecurityAlert";
import BulletedList from "@/emails/components/BulletedList";
import SessionHistory from "@/models/SessionHistory";
import { createRouter, withAuth } from "@/trpc/router";
import { RedisTwoFactor } from "@/types/twoFactorTypes";
import { formatDateTime } from "@/utils/helpers";
import { TRPCError } from "@trpc/server";
import sendMail from "emails";
import { z } from "zod";
import log from "@/lib/log";
import redis from "@/lib/redis";

export const auth = createRouter({
  verify: withAuth
    .input(
      z.object({
        fingerprint: z.string(),
        sessionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;
      const { fingerprint, sessionId } = input;

      if (sessionId !== ctx.session.id) {
        return new TRPCError({
          code: "BAD_REQUEST",
          message: "Session ID does not match.",
        });
      }

      const sessionStore = (await redis.get(
        `session:${sessionId}`,
      )) as RedisTwoFactor;

      const sessionHistory = await SessionHistory.getOne(sessionId);

      if (sessionHistory && !sessionHistory?.fingerprint) {
        const { ip, os, isBot, browser, device, engine, cpu, geo } =
          sessionStore;

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
      }

      return sessionHistory;
    }),
});
