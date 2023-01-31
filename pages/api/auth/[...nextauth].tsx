import MagicLink from "@/emails/MagicLink";
import SessionHistory from "@/models/SessionHistory";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import sendMail from "emails";
import NextAuth, { type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GithubProvider from "next-auth/providers/github";
import GitlabProvider from "next-auth/providers/gitlab";
import prisma from "@/lib/prisma";

const development = !!process.env.VERCEL_URL;

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
    }),

    GithubProvider({
      clientId: String(process.env.GITHUB_CLIENT_ID) || "",
      clientSecret: String(process.env.GITHUB_CLIENT_SECRET) || "",
    }),

    GitlabProvider({
      clientId: String(process.env.GITLAB_CLIENT_ID) || "",
      clientSecret: String(process.env.GITLAB_CLIENT_SECRET) || "",
    }),
  ],

  theme: {
    colorScheme: "dark",
  },

  pages: {
    signIn: "/auth",
    signOut: "/auth",
  },

  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 1 day
    updateAge: 6 * 60 * 60, // 6 hours
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.user = user;

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
      } = token.user as any;

      if (user) {
        const sessionId = token.sessionId as string;
        session = {
          ...session,
          id: sessionId,
          user: {
            id: user?.id,
            name: user?.name,
            email: user?.email,
            twoFactorEnabled: user?.twoFactorEnabled,
          },
        };
      }

      return session;
    },
  },

  events: {
    async signIn(message) {
      // Create an audit log entry for the sign in
    },
  },

  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
