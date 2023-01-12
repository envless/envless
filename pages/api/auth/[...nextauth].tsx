import MagicLink from "@/emails/MagicLink";
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
      }

      return token;
    },

    async session({ session, token }) {
      const { user } = token;

      if (user) {
        session.user = user;
      }

      return session;
    },
  },

  events: {
    async signIn(message) {
      // Create an audit log entry for the sign in
    },
  },
};

export default NextAuth(authOptions);
