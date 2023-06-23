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
    const { origin } = url;
    const { token } = req.nextauth;
    const { user } = token as any;
    const { keychain, twoFactor } = user;

    const loginPath = `${origin}/login`;
    const otpPath = `${origin}/auth/otp`;
    const verifyPath = `${origin}/auth/verify`;
    const twoFactorPath = `${origin}/auth/2fa`;
    const forbiddenPath = `${origin}/error/forbidden`;
    const verifyKeychainPath = `${origin}/auth/encryption/verify`;
    const downloadKeychainPath = `${origin}/auth/encryption/download`;

    const sessionId = token?.sessionId as string;
    const { isBot } = userAgent(req);

    if (isBot) {
      debug("If it's a bot, redirect to forbidden page");
      return NextResponse.redirect(forbiddenPath);
    }

    if (
      url.pathname === "/login" ||
      url.pathname === "/signup" ||
      url.pathname === "/auth/2fa" ||
      url.pathname === "/auth/verify" ||
      url.pathname === "/auth/otp" ||
      url.pathname === "/auth/encryption/verify" ||
      url.pathname === "/auth/encryption/download"
    ) {
      debug("If current page is auth, 2fa or verify auth page, skip");
      return NextResponse.next();
    }

    if (!token || !user || !sessionId) {
      debug(
        "If token, user or sessionId is not present, redirect to login page",
      );
      return NextResponse.redirect(loginPath);
    }

    if (!keychain.privateKey && keychain.temp) {
      debug(
        "Invited user is going through the keychain verification process, redirect to OTP page",
      );
      return NextResponse.redirect(otpPath);
    }

    if (!keychain.privateKey || !keychain.valid) {
      debug(
        "If privateKey is not present, or invalid, redirect to verify auth page",
      );
      return NextResponse.redirect(verifyPath);
    }

    if (keychain.privateKey && !keychain.downloaded) {
      debug(
        "If privateKey is present but not downloaded, redirect to download keychain page",
      );
      return NextResponse.redirect(downloadKeychainPath);
    }

    if (twoFactor.enabled && twoFactor.verified) {
      debug("If two factor is enabled and verified, skip");
      return NextResponse.next();
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
