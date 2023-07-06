import { NextApiRequest, NextApiResponse } from "next";
import MagicLink from "@/emails/MagicLink";
import { env } from "@/env/index.mjs";
import SessionHistory from "@/models/SessionHistory";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { LockedUser } from "@prisma/client";
import sendMail from "emails";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import GithubProvider from "next-auth/providers/github";
import GitlabProvider from "next-auth/providers/gitlab";
import * as z from "zod";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { type: "text" },
        password: { type: "password" },
      },

      async authorize(credentials, req) {
        console.log({ credentials, req });
        return null;
      },
    }),

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

          token.user = {
            ...userInSession,
            keychain: userInSession.keychain,
            twoFactor: userInSession.twoFactor,
          };
        }
      } else if (user) {
        token.id = user.id;

        const keychain = await prisma.keychain.findUnique({
          where: { userId: user.id },
          select: {
            downloaded: true,
          },
        });

        token.user = {
          ...user,
          keychain: {
            valid: session?.user?.keychain.valid ?? false,
            present: keychain ? true : false,
            downloaded: keychain?.downloaded ?? false,
          },

          twoFactor: {
            enabled: session?.user?.twoFactor.enabled ?? false,
            verified: session?.user?.twoFactor.verified ?? false,
          },
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
        locked: LockedUser | null;

        keychain: {
          temp: boolean;
          valid: boolean;
          present: boolean;
          downloaded: boolean;
          privateKey: string | null;
        };

        twoFactor: {
          enabled: boolean;
          verified: boolean;
        };
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
            locked: user.locked,

            keychain: {
              temp: user.keychain.temp ?? false,
              valid: user.keychain.valid ?? false,
              present: user.keychain.present ?? false,
              downloaded: user.keychain.downloaded ?? false,
              privateKey: user.keychain.privateKey ?? null,
            },

            twoFactor: {
              enabled: user.twoFactor.enabled ?? false,
              verified: user.twoFactor.verified ?? false,
            },
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

const TwoFactorSchema = z.object({
  enabled: z.boolean(),
  verified: z.boolean(),
});

const KeychainSchema = z.object({
  temp: z.boolean(),
  valid: z.boolean(),
  present: z.boolean(),
  downloaded: z.boolean(),
  privateKey: z.string().nullable(),
});

const UserSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().email(),
  image: z.string().optional(),
  locked: LockedUserSchema.nullable(),
  keychain: KeychainSchema,
  twoFactor: TwoFactorSchema,
});

const SessionSchema = z.object({
  user: UserSchema,
  expires: z.string(),
  id: z.string(),
});

function validateSession(session: any): boolean {
  try {
    SessionSchema.parse(session);
    return true;
  } catch (err) {
    console.error(err.message);
    return false;
  }
}
