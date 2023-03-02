import MagicLink from "@/emails/MagicLink";
import SessionHistory from "@/models/SessionHistory";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { randomBytes } from "crypto";
import sendMail from "emails";
import NextAuth, { type NextAuthOptions } from "next-auth";
import { SendVerificationRequestParams } from "next-auth/providers";
import EmailProvider from "next-auth/providers/email";
import GithubProvider from "next-auth/providers/github";
import GitlabProvider from "next-auth/providers/gitlab";
import prisma from "@/lib/prisma";

const ONE_WEEK_IN_SECONDS = 604800;
const development = !!process.env.VERCEL_URL;

const sendInviteRequest = async (params: SendVerificationRequestParams) => {
  const { identifier, url, provider } = params;

  if (typeof provider.from !== "string") {
    throw new Error(`Email missing`);
  }
  const [root, searchParams] = url.split("?");
  const sparams = new URLSearchParams(searchParams);

  const cb = sparams.get("callbackUrl") as string;
  const [cbUrl, projectIdAndRole] = cb.split("?projectId=") as [string, string];
  const [projectId, role] = projectIdAndRole.split("&role=") as [
    string,
    string,
  ];

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  const invitationToken = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + ONE_WEEK_IN_SECONDS * 1000);
  await prisma.projectInvite.create({
    data: {
      email: identifier,
      expires,
      projectId: projectId,
      invitationToken: invitationToken,
      role: role,
    },
  });

  // rebuild the params
  const newParams = {
    callbackUrl: `${cbUrl}?${new URLSearchParams({ invitationToken })}`,
    token: sparams.get("token"),
    email: sparams.get("email"),
  } as Record<string, string>;
  // rebuild the link url
  const inviteUrl = `${root}?&${new URLSearchParams(newParams).toString()}`;
  sendMail({
    subject: "Your Envless login link",
    to: identifier,
    component: (
      <MagicLink
        greeting="Hi there,"
        subText="If you don't accept the invite you can safely ignore it."
        body={
          <>
            You have been invited to the project <b>{project?.name}</b>
          </>
        }
        buttonText="Accept Invite"
        headline="Invitation to collaborate on a project"
        buttonLink={inviteUrl}
      />
    ),
  });
};

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

    EmailProvider({
      id: "invite",
      sendVerificationRequest: sendInviteRequest,
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
