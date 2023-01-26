// export { default } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { type NextRequestWithAuth } from "next-auth/middleware";
import requestIp from "request-ip";
import { getFingerprint } from "@/lib/fingerprint";
import redis from "@/lib/redis";

export const config = {
  matcher: [
    "/auth/2fa",
    "/projects",
    "/projects/:path*",
    "/settings",
    "/settings/:path*",
  ],
};

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const { origin } = req.nextUrl;
    const authUrl = `${origin}/auth`;
    const twoFaUrl = `${origin}/auth/2fa`;

    // if user is not logged in, redirect to login page
    const token = req.nextauth.token;
    if (!token) return NextResponse.redirect(authUrl);

    // if user is logged in but does not have 2fa enabled, skip
    const { user } = token as any;
    if (!user) return NextResponse.redirect(authUrl);
    if (!user.twoFactorEnabled) return NextResponse.next();

    // if current page is 2fa page, skip
    if (req.nextUrl.pathname === "/auth/2fa") return NextResponse.next();

    const userId = user.id;
    const ip = requestIp.getClientIp(req);
    const userAgent = req.headers.get("user-agent") as any;

    // Fingerprint is a hash of user's IP, user agent and user id. It is used to identify the user's device.
    const fingerprint = await getFingerprint({
      ip,
      userId,
      userAgent,
    });

    // Two factor state is stored in Redis with the fingerprint and ttl of 1 week, so that the user does not have to re-enter the code every time they log in. If the user logs in from a different device, fingerprint will change and the user will be asked to enter the code again.
    const twoFactorForUser = await redis.get(fingerprint);

    if (twoFactorForUser) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(twoFaUrl);
    }
  },

  {
    callbacks: {
      authorized: async ({ token }) => {
        return !!token;
      },
    },
  },
);
