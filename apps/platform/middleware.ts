import { userAgent } from "next/server";
import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { type NextRequestWithAuth } from "next-auth/middleware";
import log from "@/lib/log";

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
    const { nextUrl: url } = req;
    const { origin } = url;
    const { token } = req.nextauth;
    const { user } = token as any;

    const authUrl = `${origin}/login`;
    const twoFaUrl = `${origin}/auth/2fa`;
    const forbidden = `${origin}/error/forbidden`;
    const verifyAuthUrl = `${origin}/auth/verify`;

    const sessionId = token?.sessionId as string;
    const { isBot } = userAgent(req);

    if (isBot) {
      log("If it's a bot, redirect to forbidden page");
      return NextResponse.redirect(forbidden);
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

    if (!token || !user || !sessionId) {
      log("If token, user or sessionId is not present, redirect to login page");
      return NextResponse.redirect(authUrl);
    }

    const { twoFactorEnabled, twoFactorVerified } = user;
    console.log("Loading user: ", user);

    if (twoFactorEnabled && twoFactorVerified) {
      log("If two factor is enabled and verified, skip");
      return NextResponse.next();
    }

    if (twoFactorEnabled && !twoFactorVerified) {
      log("If two factor is enabled but not verified, redirect to 2fa page");

      return NextResponse.redirect(twoFaUrl);
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
