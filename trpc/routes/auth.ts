import { createRouter, withAuth } from "@/trpc/router";
import { RedisTwoFactor } from "@/types/twoFactorTypes";
import { TRPCError } from "@trpc/server";
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
      const { prisma, req } = ctx;
      const { user } = ctx.session;
      const { fingerprint, sessionId } = input;

      console.log("Comparing session ids", sessionId, ctx.session.id);

      if (sessionId !== ctx.session.id) {
        return new TRPCError({
          code: "BAD_REQUEST",
          message: "Session ID does not match.",
        });
      }

      const sessionStore = (await redis.get(
        `session:${sessionId}`,
      )) as RedisTwoFactor;

      console.log("TRPC sessionStore", sessionStore);

      return user;
    }),
});
