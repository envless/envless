import React from "react";
import InviteLink from "@/emails/InviteLink";
import { createRouter, withAuth, withoutAuth } from "@/trpc/router";
import { TRPCError } from "@trpc/server";
import argon2 from "argon2";
import { randomBytes } from "crypto";
import { addHours, isAfter } from "date-fns";
import sendMail from "emails";
import generatePassword from "omgopass";
import { z } from "zod";
import Audit from "@/lib/audit";

export const members = createRouter({
  invite: withAuth
    .input(
      z.object({
        projectId: z.string(),
        email: z.string().email(),
        role: z.enum(["guest", "developer", "mantainer", "owner"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const { projectId, email, role } = input;
      const invited = await ctx.prisma.projectInvite.findFirst({
        where: {
          AND: [{ email }, { projectId }],
        },
      });

      if (invited) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already invited this member",
        });
      }

      const invitationToken = randomBytes(32).toString("hex");
      const password = await generatePassword();
      const hashedPassword = await argon2.hash(password);

      const record = await ctx.prisma.projectInvite.create({
        data: {
          projectId,
          email,
          role,
          invitationToken,
          hashedPassword,
          invitedById: ctx.session?.user?.id as string,
        },
      });

      if (record) {
        await Audit.create({
          projectId,
          createdById: user.id,
          action: "invite.created",
          data: {
            invite: {
              id: record.id,
              email: email,
              role: role,
            },
          },
        });
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Something went wrong",
        });
      }

      const project = await ctx.prisma.project.findUnique({
        where: {
          id: projectId,
        },
      });

      sendMail({
        subject: `Invitation to join ${project?.name} on Envless`,
        to: email,
        component: (
          <InviteLink
            headline={
              <>
                Join <b>{project?.name}</b> on Envless
              </>
            }
            greeting="Hi there,"
            body={
              <>
                You have been invited to join the project <b>{project?.name}</b>{" "}
                on Envless. You will need this One-time password. Please note
                that this invitation link will expire in 48 hours.
                <br />
                <br />
                <code>
                  <pre>{password}</pre>
                </code>
              </>
            }
            subText="If you did not request this email you can safely ignore it."
            buttonText={`Join ${project?.name}`}
            buttonLink={`${process.env.BASE_URL}/auth/invite/${invitationToken}`}
          />
        ),
      });
    }),

  acceptInvite: withoutAuth
    .input(
      z.object({
        token: z.string(),
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { token, email, name, password } = input;

      const invite = await ctx.prisma.projectInvite.findFirst({
        where: {
          invitationToken: token,
        },
      });

      if (!invite) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid invite token",
        });
      }

      if (invite.email !== email) {
        throw new TRPCError({
          cause: {
            code: "BAD_REQUEST",
            message: "Invalid email address",
          },
          code: "BAD_REQUEST",
          message: "Email does not match invite",
        });
      }

      const expiresAt = addHours(invite.createdAt, 48);
      const expired = isAfter(new Date(), new Date(expiresAt));

      if (expired) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invite link has expired",
        });
      }

      const valid = await argon2.verify(invite.hashedPassword, password);

      if (!valid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid One-time password",
        });
      }

      const userExist = await ctx.prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (userExist) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already exists",
        });
      }

      const newUser = await ctx.prisma.user.create({
        data: {
          name,
          email,
        },
      });

      if (!newUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to create user",
        });
      }

      const access = await ctx.prisma.access.create({
        data: {
          userId: newUser.id,
          projectId: invite.projectId,
          role: invite.role,
        },
      });

      if (!access) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to create access",
        });
      }

      const accepted = await ctx.prisma.projectInvite.update({
        where: {
          id: invite.id,
        },
        data: {
          accepted: true,
        },
      });

      if (!accepted) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to accept invite",
        });
      }

      await Audit.create({
        projectId: invite.projectId,
        createdById: newUser.id,
        action: "invite.accepted",
        data: {
          invite: {
            id: invite.id,
            email: email,
            role: invite.role,
          },
        },
      });

      await Audit.create({
        createdById: invite.invitedById as string,
        createdForId: newUser.id,
        projectId: invite.projectId,
        action: "access.created",
        data: {
          access: {
            id: access.id,
            role: access.role,
          },
        },
      });
    }),

  getActiveMembers: withAuth
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { projectId } = input;
      const accesses = await ctx.prisma.access.findMany({
        where: {
          projectId: projectId,
        },
        include: {
          user: true,
        },
      });
      return accesses.map((access) => {
        return {
          id: access.user.id,
          name: access.user.name,
          email: access.user.email,
          image: access.user.image,
          twoFactorEnabled: access.user.twoFactorEnabled,
          role: access.role,
        };
      });
    }),
});
