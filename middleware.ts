import { NextResponse } from "next/server";
import { RedisTwoFactor } from "@/types/twoFactorTypes";
import { withAuth } from "next-auth/middleware";
import { type NextRequestWithAuth } from "next-auth/middleware";
import redis from "@/lib/redis";

export const config = {
  matcher: [
    "/auth",
    "/auth/:path*",

    "/projects",
    "/projects/:path*",

    "/settings",
    "/settings/:path*",
  ],
};

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const { nextUrl: url, geo } = req;
    const { origin } = url;
    const authUrl = `${origin}/auth`;
    const twoFaUrl = `${origin}/auth/2fa`;
    const verifyAuthUrl = `${origin}/auth/verify`;
    const { token } = req.nextauth;
    const { user } = token as any;
    const sessionId = token?.sessionId as string;

    // if token, user or sessionId is not present, redirect to login page
    if (!token || !user || !sessionId) return NextResponse.redirect(authUrl);

    // if current page is auth, 2fa or verify auth page, skip
    if (url.pathname === "/auth") return NextResponse.next();
    if (url.pathname === "/auth/2fa") return NextResponse.next();
    if (url.pathname === "/auth/verify") return NextResponse.next();

    // if user is logged in but does not have 2fa enabled, redirect to verify auth
    if (!user.twoFactorEnabled) return NextResponse.redirect(verifyAuthUrl);

    // Get two factor state from Redis
    const sessionStore = (await redis.get(
      `session:${sessionId}`,
    )) as RedisTwoFactor;

    // if sessionStore is not present, add it to Redis with geo data
    if (!sessionStore) await redis.set(`session:${sessionId}`, { geo });

    // if two factor is enabled but not verified, redirect to 2fa page
    if (
      sessionStore?.twoFactor?.enabled &&
      !sessionStore?.twoFactor?.verified
    ) {
      return NextResponse.redirect(twoFaUrl);
    }

    // if two factor is not enabled and verified, skip
    if (
      !sessionStore?.twoFactor?.enabled &&
      sessionStore?.twoFactor?.verified
    ) {
      return NextResponse.next();
    }

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
