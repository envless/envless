import * as z from "zod";
import sendMail from "emails";
import prisma from "@/lib/prisma";
import { env } from "@/env/index.mjs";
import MagicLink from "@/emails/MagicLink";
import { LockedUser } from "@prisma/client";
import SessionHistory from "@/models/SessionHistory";
import EmailProvider from "next-auth/providers/email";
import { NextApiRequest, NextApiResponse } from "next";
import GitlabProvider from "next-auth/providers/gitlab";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { type NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      sendVerificationRequest({ identifier, url }) {
        sendMail({
          subject: "Your Envless login link",
          to: identifier,
          component: (
            <MagicLink
              headline="Login to Envless"
              greeting="Hi there,"
              body={
                <>
                  We have received a login attempt. If this was you, please
                  click the button below to complete the login process.
                </>
              }
              subText="If you did not request this email you can safely ignore it."
              buttonText={"Login to Envless"}
              buttonLink={url}
            />
          ),
        });
      },

      normalizeIdentifier: (identifier) => identifier.toLowerCase().trim(),
    }),

    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),

    GitlabProvider({
      clientId: env.GITLAB_CLIENT_ID,
      clientSecret: env.GITLAB_CLIENT_SECRET,
    }),
  ],

  theme: {
    colorScheme: "dark",
  },

  pages: {
    signIn: "/login",
    signOut: "/login",
  },

  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 1 day
    updateAge: 6 * 60 * 60, // 6 hours
  },

  callbacks: {
    async jwt({ token, trigger, user, session }) {
      if (trigger === "update") {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        if (validateSession(session)) {
          const userInSession = session.user;
          // @ts-ignore
          token.user = {
            ...userInSession,
            twoFactorVerified: userInSession.twoFactorVerified ?? false,
            privateKey: userInSession.privateKey ?? null,
          };
        }
      } else if (user) {
        token.id = user.id;
        token.user = {
          ...user,
          twoFactorVerified: session?.user?.twoFactorVerified ?? false,
          privateKey: session?.user?.privateKey ?? null,
        };

        // Add the locked information to the token
        const locked = await prisma.user
          .findUnique({
            where: { id: user.id },
            include: { locked: true },
          })
          .then((user) => (user ? user.locked : null));
        (token.user as any).locked = locked;

        if (!token.sessionId) {
          const session = await SessionHistory.create({ userId: user.id });
          token.sessionId = session.id;
        }
      }

      return token;
    },
    async session({ session, token }) {
      const user: {
        id: string;
        name: string;
        email: string;
        twoFactorEnabled: boolean;
        locked: LockedUser | null;
        twoFactorVerified: boolean;
        privateKey: string | null;
      } = token.user as any;

      if (user) {
        const sessionId = token.sessionId as string;
        session = {
          ...session,
          id: sessionId,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            twoFactorEnabled: user.twoFactorEnabled,
            locked: user.locked,
            twoFactorVerified: user.twoFactorVerified,
            privateKey: user.privateKey,
          } as any,
        };
      }

      return session;
    },

    async signIn({ user }) {
      const signInUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: { locked: true },
      });

      if (signInUser && signInUser.locked) {
        return "/error/locked";
      }

      if (!signInUser && process.env.NEXT_PUBLIC_SIGNUP_DISABLED === "true") {
        return "/error/forbidden";
      }

      return true;
    },
  },

  events: {
    async signIn(message) {
      // Create an audit log entry for the sign in
    },
  },

  debug: process.env.NODE_ENV === "development",
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, authOptions);
}

const LockedUserSchema = z.object({
  id: z.string(),
  userId: z.string(),
  reason: z.string().nullable(),
  lockedAt: z.date(),
});

const UserSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().email(),
  image: z.string().optional(),
  twoFactorEnabled: z.boolean(),
  twoFactorVerified: z.boolean(),
  locked: LockedUserSchema.nullable(),
  privateKey: z.string().nullable(),
});

const SessionSchema = z.object({
  user: UserSchema,
  expires: z.string(),
  id: z.string(),
});

/**
 * Validates the session object against the `SessionSchema` using `zod`.
 *
 * @param {any} session - The session object to be validated.
 * @returns {boolean} `true` if the session object is valid, otherwise `false`.
 * @throws {Error} If the session object does not match the `SessionSchema` structure.
 *
 * @example
 * // Validating the session object
 * const session = { user: { id: 1, name: "John" }, createdAt: "2022-04-01T14:45:00Z" };
 * if (validateSession(session)) {
 *   // Do something if the session is valid
 * } else {
 *   // Do something if the session is invalid
 * }
 *
 * // Updating the SessionSchema
 * // If you introduce any new value to the session object, make sure to update the SessionSchema accordingly.
 * const SessionSchema = z.object({
 *   user: UserType,
 *   createdAt: z.string().optional(),
 * });
 */

function validateSession(session: any): boolean {
  try {
    SessionSchema.parse(session);
    return true;
  } catch (err) {
    console.error(err.message);
    return false;
  }
}
