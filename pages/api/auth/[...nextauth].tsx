import sendMail from "emails";
import prisma from "@/lib/prisma";
import MagicLink from "@/emails/MagicLink";
import EmailProvider from "next-auth/providers/email";
import GithubProvider from "next-auth/providers/github";
import GitlabProvider from "next-auth/providers/gitlab";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { type NextAuthOptions } from "next-auth";
const development = !!process.env.VERCEL_URL;

export const options: NextAuthOptions = {
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
  },

  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    // maxAge: 30 * 24 * 60 * 60, // 30 days
    // updateAge: 24 * 60 * 60, // 24 hours
  },

  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (development) {
        console.log("JWT Callback", {
          token,
          user,
          account,
          profile,
          isNewUser,
        });
      }

      if (user) {
        token.user = user;
      }

      return token;
    },

    async session({ session, user, token }) {
      if (development) {
        console.log("Session Callback", { session, user, token });
      }
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
  },

  events: {
    async signIn(message) {
      // Redirect to /onboarding if user has not created team and/or project
      const user = await message.user;
      console.log("Checking if user has created team and project", message);
    },
  },
};

export default NextAuth(options);
