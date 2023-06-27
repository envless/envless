import { userAgent } from "next/server";
import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { type NextRequestWithAuth } from "next-auth/middleware";

const debug = require("debug")("envless:middleware");

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

    const loginPath = `${origin}/login`;
    const otpPath = `${origin}/auth/otp`;
    const signupPath = `${origin}/signup`;
    const verifyPath = `${origin}/auth/verify`;
    const twoFactorPath = `${origin}/auth/2fa`;
    const forbiddenPath = `${origin}/error/forbidden`;
    const verifyKeychainPath = `${origin}/encryption/verify`;
    const downloadKeychainPath = `${origin}/encryption/download`;

    const sessionId = token?.sessionId as string;
    const { isBot } = userAgent(req);

    if (isBot) {
      debug("If it's a bot, redirect to forbidden page");
      return NextResponse.redirect(forbiddenPath);
    }

    if (
      [
        otpPath,
        loginPath,
        signupPath,
        verifyPath,
        twoFactorPath,
        forbiddenPath,
        verifyKeychainPath,
        downloadKeychainPath,
      ].includes(href)
    ) {
      debug("If current page is auth, 2fa or verify auth page, skip");
      return NextResponse.next();
    }

    if (!token || !user || !sessionId || !keychain) {
      debug(
        "If token, user or sessionId is not present, redirect to login page",
      );
      return NextResponse.redirect(loginPath);
    }

    const { temp, valid, present, downloaded, privateKey } = keychain;

    if (!present || !privateKey || !valid || temp || !downloaded) {
      debug(
        "If privateKey is not present, or invalid, redirect to verify auth page",
      );
      return NextResponse.redirect(verifyPath);
    }

    if (twoFactor.enabled && !twoFactor.verified) {
      debug("If two factor is enabled but not verified, redirect to 2fa page");

      return NextResponse.redirect(twoFactorPath);
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
