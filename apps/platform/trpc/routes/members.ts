import useAccess from "@/hooks/useAccess";
import { generateVerificationUrl } from "@/models/user";
import { createRouter, withAuth, withoutAuth } from "@/trpc/router";
import {
  ACCESS_DELETED,
  ACCESS_UPDATED,
  INVITE_CREATED,
} from "@/types/auditActions";
import { type MemberType } from "@/types/resources";
import { type MembershipStatus, UserRole } from "@prisma/client";
import { User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import Audit from "@/lib/audit";
import { QUERY_ITEMS_PER_PAGE } from "@/lib/constants";
import { encrypt } from "@/lib/encryption/openpgp";
import prisma from "@/lib/prisma";

const getEncryptionDetails = async ({ projectId }: { projectId: string }) => {
  const accesses = await prisma.access.findMany({
    where: { projectId },
    select: { userId: true },
  });

  const memberIds = accesses.map((access) => access.userId);
  const keychains = await prisma.keychain.findMany({
    where: { userId: { in: memberIds } },
    select: { publicKey: true },
  });

  const projectKey = await prisma.encryptedProjectKey.findUnique({
    where: { projectId },
    select: { encryptedKey: true },
  });

  const encryptedProjectKey = projectKey?.encryptedKey;
  const publicKeys = keychains.map((keychain) => keychain.publicKey);

  return [publicKeys, encryptedProjectKey];
};

export const members = createRouter({
  create: withAuth
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
      let hasUserAccount = false as boolean;
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

      const existingMember = await prisma.user.findUnique({
        where: { email },
      });

      if (existingMember) {
        hasUserAccount = true;
        member = existingMember;
      } else {
        member = await prisma.user.create({
          data: { email, name },
        });

        const verificationString = (await encrypt(member.id, [
          publicKey,
        ])) as string;

        await prisma.keychain.upsert({
          where: { userId: member.id },
          update: {},
          create: {
            publicKey,
            verificationString,
            userId: member.id,
            downloaded: true,
            revocationCertificate: revocationCertificate,
          },
        });
      }

      const access = await prisma.access.upsert({
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

      await prisma.invite.upsert({
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
          accessId: access.id,
          expires,
        },

        update: {
          projectId,
          inviteeId: member.id,
          invitorId: userId,
          accessId: access.id,
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

      const [publicKeys, encryptedProjectKey] = await getEncryptionDetails({
        projectId,
      });

      const verificationUrl = await generateVerificationUrl(member, expires);
      const redirect = await prisma.redirect.create({
        data: { url: verificationUrl },
      });

      return {
        publicKeys,
        hasUserAccount,
        encryptedProjectKey,
        invitation: `${process.env.NEXTAUTH_URL}/r/invitation/${redirect.id}`,
      };
    }),

  updateAccess: withAuth
    .input(
      z.object({
        projectId: z.string(),
        memberId: z.string(),
        role: z.enum(Object.values(UserRole) as [UserRole, ...UserRole[]]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { projectId, memberId, role } = input;
      const { user: currentUser } = ctx.session;

      const hasAccess = await useAccess({ userId: currentUser.id, projectId });

      if (!hasAccess) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "You do not have the required permission to perform this action. Please contact the project owner to request permission.",
        });
      }

      const currentMemberAccess = await prisma.access.findFirst({
        where: {
          AND: {
            projectId,
            userId: memberId,
          },
        },
      });

      if (!currentMemberAccess) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Member not found",
        });
      }

      await prisma.access.update({
        where: {
          id: currentMemberAccess.id,
        },
        data: {
          role,
        },
      });

      const member = await prisma.user.findUnique({
        where: {
          id: memberId,
        },

        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      await Audit.create({
        createdById: currentUser.id,
        createdForId: memberId,
        projectId: projectId,
        action: ACCESS_UPDATED,
        data: {
          member,
          access: {
            id: currentMemberAccess.id,
            role: role,
          },
        },
      });
    }),

  removeAccess: withAuth
    .input(
      z.object({
        projectId: z.string(),
        memberId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { projectId, memberId } = input;
      const { user } = ctx.session;
      const { id: userId } = user;

      const hasAccess = await useAccess({ userId, projectId });

      if (!hasAccess) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "You do not have the required permission to perform this action. Please contact the project owner to request permission.",
        });
      }

      const access = await prisma.access.findFirst({
        where: {
          AND: {
            projectId,
            userId: memberId,
          },
        },
      });

      if (!access) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Member not found",
        });
      }

      await prisma.access.delete({
        where: {
          id: access.id,
        },
      });

      const member = await prisma.user.findUnique({
        where: { id: memberId },
      });

      await Audit.create({
        createdById: userId,
        createdForId: memberId,
        projectId: projectId,
        action: ACCESS_DELETED,
        data: {
          member: {
            id: memberId,
            email: member?.email,
          },
        },
      });

      const [publicKeys, encryptedProjectKey] = await getEncryptionDetails({
        projectId,
      });

      return {
        publicKeys,
        encryptedProjectKey,
      };
    }),

  getAll: withAuth
    .input(z.object({ page: z.number(), projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const accesses = await prisma.access.findMany({
        where: {
          projectId: input.projectId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
          invite: true,
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
          invite: access.invite,
        } as MemberType;
      });
    }),
});
