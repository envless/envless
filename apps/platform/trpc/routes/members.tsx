import React, { Fragment } from "react";
import InviteLink from "@/emails/InviteLink";
import { env } from "@/env/index.mjs";
import { createRouter, withAuth, withoutAuth } from "@/trpc/router";
import { ACCESS_CREATED } from "@/types/auditActions";
import { type MemberType } from "@/types/resources";
import { type Access, MembershipStatus, UserRole } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import argon2 from "argon2";
import { randomBytes } from "crypto";
import { addHours } from "date-fns";
import sendMail from "emails";
import { z } from "zod";
import Audit from "@/lib/audit";
import { QUERY_ITEMS_PER_PAGE } from "@/lib/constants";

interface CheckAccessAndPermissionArgs {
  ctx: any;
  projectId: string;
  userId: string;
  targetUserId: string;
  currentUserRole: UserRole;
  targetUserRole: UserRole;
  newRole?: UserRole;
}

const checkAccessAndPermission = async ({
  ctx,
  projectId,
  currentUserRole,
  targetUserId,
  targetUserRole,
  newRole,
}: CheckAccessAndPermissionArgs) => {
  const { id: userId } = ctx.session.user;

  const UNAUTHORIZED_ERROR: { code: TRPCError["code"]; message: string } = {
    code: "UNAUTHORIZED",
    message:
      "You do not have the required permission to perform this action. Please contact the project owner to request permission",
  };

  // Check if user is owner or maintainer
  if (
    !(
      currentUserRole === UserRole.maintainer ||
      currentUserRole === UserRole.owner
    )
  ) {
    throw new TRPCError(UNAUTHORIZED_ERROR);
  }
  if (
    currentUserRole === UserRole.maintainer &&
    targetUserRole === UserRole.owner
  ) {
    // Check if maintainer is trying to update an owner
    throw new TRPCError(UNAUTHORIZED_ERROR);
  }

  // Check if trying to update an owner's role
  if (newRole === UserRole.owner) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "The owner role cannot be updated",
    });
  }

  // Check if user is trying to perform the action on their account
  if (targetUserId === userId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You cannot perform this action on yourself",
    });
  }

  // Fetch access records for current user and target user
  const access: Access[] = await ctx.prisma.access.findMany({
    where: {
      projectId: projectId,
      userId: {
        in: [userId, targetUserId],
      },
      role: {
        in: [currentUserRole, targetUserRole],
      },
    },
    orderBy: {
      role: "asc",
    },
  });

  if (access.length !== 2) {
    throw new TRPCError(UNAUTHORIZED_ERROR);
  }

  // Sort access records so that the current user comes first
  const [firstUser, secondUser] = access.sort((a, b) => {
    if (a.userId === userId) {
      return -1;
    } else if (b.userId === userId) {
      return 1;
    }
    return 0;
  });

  // Assign current user and target user based on the sorted order
  const [currentUser, targetUser] =
    firstUser.userId === userId
      ? [firstUser, secondUser]
      : [secondUser, firstUser];

  if (currentUser.userId !== userId || targetUser.userId !== targetUserId) {
    throw new TRPCError(UNAUTHORIZED_ERROR);
  }
};

export const members = createRouter({
  update: withAuth
    .input(
      z.object({
        targetUserId: z.string(),
        projectId: z.string(),
        newRole: z.enum(Object.values(UserRole) as [UserRole, ...UserRole[]]),
        currentUserRole: z.enum(
          Object.values(UserRole) as [UserRole, ...UserRole[]],
        ),
        targetUserRole: z.enum(
          Object.values(UserRole) as [UserRole, ...UserRole[]],
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const {
        targetUserId,
        projectId,
        newRole,
        currentUserRole,
        targetUserRole,
      } = input;
      const { id: userId } = ctx.session.user;

      await checkAccessAndPermission({
        ctx,
        projectId,
        currentUserRole,
        targetUserRole,
        targetUserId,
        userId,
        newRole,
      });

      const updatedMember = await ctx.prisma.access.update({
        where: {
          userId_projectId: {
            userId: targetUserId,
            projectId,
          },
        },
        data: {
          role: newRole,
        },
      });
      return updatedMember;
    }),

  updateUserAccessStatus: withAuth
    .input(
      z.object({
        targetUserId: z.string(),
        projectId: z.string(),
        currentUserRole: z.enum(
          Object.values(UserRole) as [UserRole, ...UserRole[]],
        ),
        targetUserRole: z.enum(
          Object.values(UserRole) as [UserRole, ...UserRole[]],
        ),
        status: z.enum(
          Object.values(MembershipStatus) as [
            MembershipStatus,
            ...MembershipStatus[],
          ],
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const {
        targetUserId,
        projectId,
        currentUserRole,
        targetUserRole,
        status,
      } = input;
      const { id: userId } = ctx.session.user;

      // Check if owner is being removed from project
      if (targetUserRole === UserRole.owner && !status) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "The project owner cannot be removed from the project",
        });
      }
      await checkAccessAndPermission({
        ctx,
        projectId,
        currentUserRole,
        targetUserRole,
        targetUserId,
        userId,
      });

      const updatedMember = await ctx.prisma.access.update({
        where: {
          userId_projectId: {
            userId: targetUserId,
            projectId,
          },
        },
        data: {
          status,
        },
      });
      return updatedMember;
    }),
  invite: withAuth
    .input(
      z.object({
        projectId: z.string(),
        email: z.string().email(),
        role: z.enum(Object.values(UserRole) as [UserRole, ...UserRole[]]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const { projectId, email, role } = input;

      const existingUser = await ctx.prisma.user.findFirst({
        where: {
          email,
        },
        select: {
          id: true,
          access: {
            where: {
              AND: [{ projectId }],
            },
          },
        },
      });

      const invitationToken = randomBytes(32).toString("hex");
      const password = randomBytes(32).toString("hex");
      const hashedPassword = await argon2.hash(password);
      const expiresAt = addHours(new Date(), 48);

      // If the user already exists in the system, add an access entry for the project if they don't already have one.
      if (existingUser) {
        if (existingUser.access.length > 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This member has already been invited to the project",
          });
        }

        const invite = await ctx.prisma.projectInvite.create({
          data: {
            projectId,
            invitationToken,
            hashedPassword,
            invitedById: user.id,
            invitationTokenExpiresAt: expiresAt,
          },
        });

        if (!invite) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Something went wrong",
          });
        }

        await ctx.prisma.access.create({
          data: {
            projectId,
            projectInviteId: invite.id,
            role,
            status: MembershipStatus.pending,
            userId: existingUser.id,
          },
        });

        await Audit.create({
          projectId,
          createdById: user.id,
          action: "invite.created",
          data: {
            invite: {
              id: invite.id,
              email: email,
              role: role,
            },
          },
        });

        // If there is no existing user in the system with the given email address, create a new user.
      } else {
        const invite = await ctx.prisma.projectInvite.create({
          data: {
            projectId,
            invitationToken,
            hashedPassword,
            invitedById: user.id,
            invitationTokenExpiresAt: expiresAt,
          },
        });

        if (!invite) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Something went wrong",
          });
        }

        const newUser = await ctx.prisma.user.create({
          data: {
            email,
            access: {
              create: [
                {
                  projectId: projectId,
                  role: role,
                  status: MembershipStatus.pending,
                  projectInviteId: invite.id,
                },
              ],
            },
          },
        });

        if (!newUser) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to create user",
          });
        }

        await Audit.create({
          projectId,
          createdById: user.id,
          action: "invite.created",
          data: {
            invite: {
              id: invite.id,
              email: email,
              role: role,
            },
          },
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
              <Fragment>
                Join <b>{project?.name}</b> on Envless
              </Fragment>
            }
            greeting="Hi there,"
            body={
              <Fragment>
                You have been invited to join the project <b>{project?.name}</b>{" "}
                on Envless. You will need this One-time password. Please note
                that this invitation link will expire in 48 hours.
                <br />
                <br />
                <code>
                  <pre>{password}</pre>
                </code>
              </Fragment>
            }
            subText="If you did not request this email you can safely ignore it."
            buttonText={`Join ${project?.name}`}
            buttonLink={`${env.BASE_URL}/auth/invite/${invitationToken}`}
          />
        ),
      });
    }),
  reInvite: withAuth
    .input(
      z.object({
        projectId: z.string(),
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const { projectId, email } = input;

      const existingAccess = await ctx.prisma.access.findFirst({
        where: {
          AND: [{ user: { email } }, { projectId }],
        },
      });

      if (!existingAccess?.projectInviteId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invite not found",
        });
      }

      if (existingAccess.status !== MembershipStatus.pending) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This member has already accepted the invitation",
        });
      }

      const invitationToken = randomBytes(32).toString("hex");
      const password = randomBytes(32).toString("hex");
      const hashedPassword = await argon2.hash(password);
      const expiresAt = addHours(new Date(), 48);

      const invite = await ctx.prisma.projectInvite.update({
        where: {
          id: existingAccess.projectInviteId,
        },
        data: {
          invitationToken,
          invitedById: user.id,
          hashedPassword,
          invitationTokenExpiresAt: expiresAt,
        },
      });

      if (invite) {
        await Audit.create({
          projectId,
          createdById: user.id,
          action: "invite.recreated",
          data: {
            invite: {
              id: invite.id,
              email: email,
              role: existingAccess.role,
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
              <Fragment>
                Join <b>{project?.name}</b> on Envless
              </Fragment>
            }
            greeting="Hi there,"
            body={
              <Fragment>
                You have been invited to join the project <b>{project?.name}</b>{" "}
                on Envless. You will need this One-time password. Please note
                that this invitation link will expire in 48 hours.
                <br />
                <br />
                <code>
                  <pre>{password}</pre>
                </code>
              </Fragment>
            }
            subText="If you did not request this email you can safely ignore it."
            buttonText={`Join ${project?.name}`}
            buttonLink={`${env.BASE_URL}/auth/invite/${invitationToken}`}
          />
        ),
      });
    }),
  deleteInvite: withAuth
    .input(
      z.object({
        projectId: z.string(),
        projectInviteId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { projectId, projectInviteId } = input;
      const { user } = ctx.session;

      const invite = await ctx.prisma.projectInvite.findFirst({
        where: {
          AND: {
            id: projectInviteId,
            projectId,
            invitationTokenExpiresAt: {
              gt: new Date(), // Only allow deletion if the invite link has not expired yet
            },
          },
        },
        include: {
          access: true,
        },
      });

      if (!invite) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid or expired invitation link",
        });
      }

      await ctx.prisma.access.delete({
        where: {
          projectInviteId,
        },
      });

      return { success: true };
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
          AND: [
            { invitationToken: token },
            {
              invitationTokenExpiresAt: {
                gt: new Date(), // Only allow acceptance if the invite link has not expired yet
              },
            },
          ],
        },
      });

      if (!invite) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid or expired invitation link",
        });
      }

      const valid = await argon2.verify(invite.hashedPassword, password);

      if (!valid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid One-time password",
        });
      }

      try {
        // Update the user name here
        const newUser = await ctx.prisma.user.update({
          where: { email },
          data: { name },
        });

        // update access.status to "active"
        const updatedAccess = await ctx.prisma.access.update({
          where: {
            projectInviteId: invite.id,
          },
          data: {
            status: MembershipStatus.active,
            projectInvite: {
              update: {
                invitationTokenExpiresAt: new Date(), // expire the token
              },
            },
          },
        });

        if (!updatedAccess) {
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
              role: updatedAccess.role,
            },
          },
        });

        await Audit.create({
          createdById: invite.invitedById as string,
          createdForId: newUser.id,
          projectId: invite.projectId,
          action: ACCESS_CREATED,
          data: {
            access: {
              id: updatedAccess.id,
              role: updatedAccess.role,
            },
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Failed to accept invite, invalid or expired invitation link",
        });
      }
    }),
  getAll: withAuth
    .input(z.object({ page: z.number(), projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const accesses = await ctx.prisma.access.findMany({
        where: {
          projectId: input.projectId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
          projectInvite: true,
        },
        take: QUERY_ITEMS_PER_PAGE,
        skip: (input.page - 1) * QUERY_ITEMS_PER_PAGE,
      });

      return accesses.map((access) => {
        return {
          id: access.user.id,
          projectInviteId: access.projectInviteId,
          projectInvite: access.projectInvite,
          name: access.user.name,
          email: access.user.email,
          image: access.user.image,
          twoFactorEnabled: access.user.twoFactorEnabled,
          role: access.role,
          status: access.status,
        } as MemberType;
      });
    }),
});
