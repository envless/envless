import React from "react";
import MagicLink from "@/emails/MagicLink";
import { createRouter, withAuth } from "@/trpc/router";
import { createHash, randomBytes } from "crypto";
import sendMail from "emails";
import { z } from "zod";
import Audit from "@/lib/audit";

const ONE_WEEK_IN_SECONDS = 604800;

export const members = createRouter({
  getAll: withAuth.query(({ ctx }) => {
    // return ctx.prisma.projects.findMany();
    return [];
  }),

  inviteMember: withAuth
    .input(
      z.object({
        memberEmail: z.string(),
        projectId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { user } = ctx.session;
      const { projectId, memberEmail } = input;

      const project = await prisma.project.findUnique({
        where: {
          id: projectId,
        },
      });
      if (!project) {
        throw new Error("Project not found");
      }
      // same method of generating a token as next-auth
      const token = randomBytes(32).toString("hex");

      const expires = new Date(Date.now() + ONE_WEEK_IN_SECONDS * 1000);

      const projectInvite = await prisma.projectInvite.create({
        data: {
          email: memberEmail,
          expires,
          projectId: project.id,
        },
      });

      // await Audit.create({
      //   createdById: user.id,
      //   createdForId: user.id,
      //   projectId: project.id,
      //   action: "created.access",
      //   data: {
      //     projectInvite: {
      //       id: access.id,
      //       role: access.role,
      //     },
      //   },
      // });

      const params = new URLSearchParams({
        callbackUrl: `${process.env.NEXTAUTH_URL}/${"slug"}`,
        email: memberEmail,
        token,
      });

      const url = `${process.env.NEXTAUTH_URL}/api/auth/callback/email?${params}`;

      sendMail({
        subject: "Your Envless login link",
        to: memberEmail,
        component: React.createElement(MagicLink, {
          buttonLink: url,
          buttonText: "Accept Invite",
          headline: "Invitation to collaborate on a project",
          greeting: "Hi there,",
          subText:
            "If you did not request this email you can safely ignore it.",
          body: React.createElement(
            "p",
            "We have received a login attempt. If this was you, please click the button below to complete the login process.",
          ),
        }),
      });

      return projectInvite;
    }),
});
