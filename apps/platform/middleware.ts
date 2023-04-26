import { NextResponse } from "next/server";
import { userAgent } from "next/server";
import { RedisTwoFactor } from "@/types/twoFactorTypes";
import { withAuth } from "next-auth/middleware";
import { type NextRequestWithAuth } from "next-auth/middleware";
import log from "@/lib/log";
import redis from "@/lib/redis";

export const config = {
  matcher: [
    "/auth/2fa",
    "/auth/verify",

    "/projects",
    "/projects/:path*",

    "/settings",
    "/settings/:path*",
  ],
};

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const { nextUrl: url, geo, ip } = req;
    const { origin } = url;
    const { token } = req.nextauth;
    const { user } = token as any;

    const authUrl = `${origin}/login`;
    const twoFaUrl = `${origin}/auth/2fa`;
    const forbidden = `${origin}/error/forbidden`;
    const verifyAuthUrl = `${origin}/auth/verify`;

    const sessionId = token?.sessionId as string;
    const { isBot, browser, device, engine, os, cpu } = userAgent(req);

    if (isBot) {
      log("If it's a bot, redirect to forbidden page");
      return NextResponse.redirect(forbidden);
    }

    if (!token || !user || !sessionId) {
      log("If token, user or sessionId is not present, redirect to login page");
      return NextResponse.redirect(authUrl);
    }

    const sessionStore = (await redis.get(
      `session:${sessionId}`,
    )) as RedisTwoFactor;

    const mfa = {
      enabled: user.twoFactorEnabled,
      verified: sessionStore?.mfa || false,
    };

    log("Two Factor Status", mfa);

    if (!sessionStore) {
      log("If sessionStore is not present, add it to Redis with geo data");
      await redis.set(
        `session:${sessionId}`,
        {
          ip,
          geo,
          isBot,
          browser,
          device,
          engine,
          os,
          cpu,
          mfa: false,
        },
        { ex: 60 * 60 * 24 * 7 }, // 7 days
      );

      if (!mfa.enabled) {
        log(
          "If user is logged in but does not have 2fa enabled, redirect to verify auth",
        );

        return NextResponse.redirect(verifyAuthUrl);
      }
    }

    if (
      url.pathname === "/login" ||
      url.pathname === "/signup" ||
      url.pathname === "/auth/2fa" ||
      url.pathname === "/auth/verify"
    ) {
      log("If current page is auth, 2fa or verify auth page, skip");
      return NextResponse.next();
    }

    if (mfa.enabled && !mfa.verified) {
      log("If two factor is enabled but not verified, redirect to 2fa page");
      return NextResponse.redirect(twoFaUrl);
    }

    if (mfa.enabled && mfa.verified) {
      log("If two factor is not enabled and verified, skip");
      return NextResponse.next();
    }

    log("If two factor is not enabled, skip");
    return NextResponse.next();
  },

  {
    callbacks: {
      authorized: async ({ token }) => {
        return !!token;
      },
    },
  },
);
