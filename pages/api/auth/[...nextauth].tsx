import sendMail from "emails";
import prisma from "@/lib/prisma";
import MagicLink from "@/emails/MagicLink";
import EmailProvider from "next-auth/providers/email";
import GithubProvider from "next-auth/providers/github";
import GitlabProvider from "next-auth/providers/gitlab";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { type NextAuthOptions } from "next-auth";
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
  },

  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    // maxAge: 30 * 24 * 60 * 60, // 30 days
    // updateAge: 24 * 60 * 60, // 24 hours
  },

  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.id = user.id;
        token.user = user;
      }

      if (account) {
        token.accessToken = account.access_token;
      }

      return token;
    },

    async session({ session, token }) {
      // TODO - implement 2FA here
      const { user } = token;
      token.jwt = true;
      // console.log("Session callback for user ", user);
      if (user) {
        session.user = user;
      }

      return session;
    },
  },

  events: {
    async signIn(message) {
      // Redirect to /onboarding if user has not created team and/or project
      const user = await message.user;

      // redirect user to /projects
      // return Promise.resolve("/projects");
    },
  },
};

export default NextAuth(authOptions);
