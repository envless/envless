import React, { Fragment } from "react";
import InviteLink from "@/emails/InviteLink";
import { env } from "@/env/index.mjs";
import useAccess from "@/hooks/useAccess";
import { generateVerificationUrl } from "@/models/user";
import { createRouter, withAuth, withoutAuth } from "@/trpc/router";
import { INVITE_CREATED } from "@/types/auditActions";
import { type MemberType } from "@/types/resources";
import { type Access, MembershipStatus, UserRole } from "@prisma/client";
import { User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import Audit from "@/lib/audit";
import { QUERY_ITEMS_PER_PAGE } from "@/lib/constants";
import { encrypt } from "@/lib/encryption/openpgp";

interface CheckAccessAndPermissionArgs {
  ctx: any;
  userId: string;
  projectId: string;
  newRole?: UserRole;
  targetUserId: string;
  currentUserRole: UserRole;
  targetUserRole: UserRole;
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
  createInvite: withAuth
    .input(
      z.object({
        name: z.string().optional().nullable(),
        email: z.string(),
        role: z.enum(Object.values(UserRole) as [UserRole, ...UserRole[]]),
        projectId: z.string(),
        publicKey: z.string(),
        revocationCertificate: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let member = null as User | null;
      const { id: userId } = ctx.session.user;
      const { name, email, projectId, role, publicKey, revocationCertificate } =
        input;

      const expires = new Date(
        Date.now() +
          ((process.env.INVITATION_EXPIRE_DAYS || 7) as number) *
            24 *
            60 *
            60 *
            1000,
      ) as Date; // 7 days by default

      const hasAccess = await useAccess({ userId, projectId });

      if (!hasAccess) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "You do not have the required permission to perform this action. Please contact the project owner to request permission.",
        });
      }

      const existingMember = await ctx.prisma.user.findUnique({
        where: { email },
      });

      if (existingMember) {
        member = existingMember;
      } else {
        member = await ctx.prisma.user.create({
          data: { email, name },
        });
      }

      const access = await ctx.prisma.access.upsert({
        where: {
          userId_projectId: {
            projectId,
            userId: member.id,
          },
        },

        create: {
          projectId,
          userId: member.id,
          role,
          status: MembershipStatus.pending,
        },

        update: {
          projectId,
          userId: member.id,
          role,
          status: MembershipStatus.pending,
        },
      });

      await ctx.prisma.invite.upsert({
        where: {
          inviteeId_projectId: {
            projectId,
            inviteeId: member.id,
          },
        },

        create: {
          projectId,
          inviteeId: member.id,
          invitorId: userId,
          expires,
        },

        update: {
          projectId,
          inviteeId: member.id,
          invitorId: userId,
          expires,
        },
      });

      await Audit.create({
        createdById: userId,
        createdForId: member.id,
        projectId: projectId,
        action: INVITE_CREATED,
        data: {
          member: {
            id: member.id,
            name: member.name,
            email: member.email,
          },
          access: {
            id: access.id,
            role: access.role,
          },
        },
      });

      const verificationString = (await encrypt(member.id, [
        publicKey,
      ])) as string;

      await ctx.prisma.keychain.upsert({
        where: { userId: member.id },
        update: {},
        create: {
          publicKey,
          verificationString,
          userId: member.id,
          revocationCertificate: revocationCertificate,
        },
      });

      const accesses = await ctx.prisma.access.findMany({
        where: { projectId },
        select: { userId: true },
      });

      const memberIds = accesses.map((access) => access.userId);
      const keychains = await ctx.prisma.keychain.findMany({
        where: { userId: { in: memberIds } },
        select: { publicKey: true },
      });

      const projectKey = await ctx.prisma.encryptedProjectKey.findUnique({
        where: { projectId },
        select: { encryptedKey: true },
      });

      const encryptedProjectKey = projectKey?.encryptedKey;
      const publicKeys = keychains.map((keychain) => keychain.publicKey);
      const verificationUrl = await generateVerificationUrl(member, expires);
      const redirect = await ctx.prisma.redirect.create({
        data: {
          url: verificationUrl,
        },
      });

      return {
        publicKeys,
        encryptedProjectKey,
        invitation: `${process.env.NEXTAUTH_URL}/r/invitation/${redirect.id}`,
      };
    }),

  updateProjectKey: withAuth
    .input(
      z.object({
        projectId: z.string(),
        encryptedProjectKey: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.session.user;
      const { projectId, encryptedProjectKey } = input;
      const hasAccess = await useAccess({ userId, projectId });

      if (!hasAccess) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "You do not have the required permission to perform this action. Please contact the project owner to request permission.",
        });
      }

      await ctx.prisma.encryptedProjectKey.upsert({
        where: { projectId },
        update: { encryptedKey: encryptedProjectKey },
        create: { encryptedKey: encryptedProjectKey, projectId },
      });

      return { success: true };
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

  deleteInvite: withAuth
    .input(
      z.object({
        projectId: z.string(),
        inviteId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { projectId, inviteId } = input;
      const { user } = ctx.session;

      const invite = await ctx.prisma.invite.findFirst({
        where: {
          AND: {
            id: inviteId,
            projectId,
            expires: {
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
          inviteId,
        },
      });

      return { success: true };
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
        },
        take: QUERY_ITEMS_PER_PAGE,
        skip: (input.page - 1) * QUERY_ITEMS_PER_PAGE,
      });

      return accesses.map((access) => {
        return {
          id: access.user.id,
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
