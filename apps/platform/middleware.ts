import { userAgent } from "next/server";
import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { type NextRequestWithAuth } from "next-auth/middleware";

const debug = require("debug")("platform:middleware");

export const config = {
  matcher: [
    "/auth/:path*",

    "/projects",
    "/projects/:path*",

    "/settings",
    "/settings/:path*",
  ],
};

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const { nextUrl: url } = req;
    const { origin, href } = url;
    const { token } = req.nextauth;
    const { user } = token as any;
    const { keychain, twoFactor } = user;

    const loginUrl = `${origin}/login`;
    const signupUrl = `${origin}/signup`;
    const twoFactorUrl = `${origin}/auth/2fa`;
    const verifyAuthUrl = `${origin}/auth/verify`;
    const forbiddenUrl = `${origin}/error/forbidden`;
    const verifyKeychainUrl = `${origin}/encryption/verify`;
    const downloadKeychainUrl = `${origin}/encryption/download`;

    const sessionId = token?.sessionId as string;
    const { isBot } = userAgent(req);

    if (isBot) {
      debug("If it's a bot, redirect to forbidden page");
      return NextResponse.redirect(forbiddenUrl);
    }

    if (
      [
        loginUrl,
        signupUrl,
        twoFactorUrl,
        verifyAuthUrl,
        forbiddenUrl,
        verifyKeychainUrl,
        downloadKeychainUrl,
      ].includes(href)
    ) {
      debug("If current page is auth, 2fa or verify auth page, skip");
      return NextResponse.next();
    }

    if (!token || !user || !sessionId || !keychain) {
      debug(
        "If token, user or sessionId is not present, redirect to login page",
      );
      return NextResponse.redirect(loginUrl);
    }

    const { temp, valid, present, downloaded, privateKey } = keychain;

    if (!present || !privateKey || !valid || temp || !downloaded) {
      debug(
        "If privateKey is not present, or invalid, redirect to verify auth page",
      );

      return NextResponse.redirect(verifyAuthUrl);
    }

    if (twoFactor.enabled && !twoFactor.verified) {
      debug("If two factor is enabled but not verified, redirect to 2fa page");

      return NextResponse.redirect(twoFactorUrl);
    }

    debug("If two factor is not enabled, skip");
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
