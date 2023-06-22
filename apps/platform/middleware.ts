import { userAgent } from "next/server";
import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { type NextRequestWithAuth } from "next-auth/middleware";
import log from "@/lib/log";

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
      log("If it's a bot, redirect to forbidden page");
      return NextResponse.redirect(forbiddenPath);
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
      return NextResponse.redirect(loginPath);
    }

    const {
      privateKey,
      twoFactorEnabled,
      twoFactorVerified,
      isPrivateKeyValid,
    } = user;
    log("Loading user: ", user);

    if (
      (!otpPath || !verifyKeychainPath || !downloadKeychainPath) &&
      (!privateKey || !isPrivateKeyValid)
    ) {
      log(
        "If privateKey is not present, or invalid, redirect to verify auth page",
      );
      return NextResponse.redirect(verifyPath);
    }

    if (twoFactorEnabled && twoFactorVerified) {
      log("If two factor is enabled and verified, skip");
      return NextResponse.next();
    }

    if (twoFactorEnabled && !twoFactorVerified) {
      log("If two factor is enabled but not verified, redirect to 2fa page");

      return NextResponse.redirect(twoFactorPath);
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
