import MagicLink from "@/emails/MagicLink";
import { UserType } from "@/types/resources";
import { Project, User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { createHash, randomBytes } from "crypto";
import sendMail from "emails";
import Audit from "@/lib/audit";
import prisma from "@/lib/prisma";

type LockUserAccountAndSendEmailArgs = {
  user: UserType;
  reason: string;
  emailSubject: string;
  emailTemplate: JSX.Element;
};

export const lockUserAccountAndSendEmail = async ({
  user,
  reason,
  emailSubject,
  emailTemplate,
}: LockUserAccountAndSendEmailArgs) => {
  const lock = await prisma.lockedUser.create({
    data: {
      user: {
        connect: {
          id: user.id,
        },
      },
      reason,
    },
  });

  await sendMail({
    subject: emailSubject,
    to: user.email,
    component: emailTemplate,
  });

  return lock;
};

export const hashToken = (token: string) => {
  return createHash("sha256")
    .update(`${token}${process.env.NEXTAUTH_SECRET}`)
    .digest("hex");
};

export const sendVerificationEmail = async (user: User) => {
  const firstName = user.name?.split(" ")[0];
  const token = randomBytes(32).toString("hex");
  const TWENTY_FOUR_HOURS_IN_SECONDS = 60 * 60 * 24;
  const expires = new Date(Date.now() + TWENTY_FOUR_HOURS_IN_SECONDS * 1000);

  await prisma.verificationToken.create({
    data: {
      identifier: user.email,
      token: hashToken(token),
      expires,
    },
  });

  const params = new URLSearchParams({
    callbackUrl: `${process.env.NEXTAUTH_URL}/projects`,
    email: user.email,
    token,
  });

  const url = `${process.env.NEXTAUTH_URL}/api/auth/callback/email?${params}`;

  await sendMail({
    subject: "Verify your email address",
    to: user.email,
    component: (
      <MagicLink
        headline="Verify your email address"
        greeting={`Hi ${firstName || "there"},`}
        body={
          <>
            Welcome to Envless! Please verify your email address by clicking the
            button below.
          </>
        }
        subText="If you did not signup for Envless, your account is not compromised and its safe to ignore this message."
        buttonText={"Verify your email address"}
        buttonLink={url}
      />
    ),
  });

  return {
    message:
      "We have sent you an email to verify your email address. Please check your inbox.",
  };
};

type InviteParams = {
  otp: string;
  toId: string;
  fromId: string;
  projectId: string;
  reinvite?: boolean;
};

export const sendInvitationEmail = async ({
  otp,
  toId,
  fromId,
  projectId,
  reinvite,
}: InviteParams) => {
  const member = await prisma.user.findUnique({
    where: { id: toId },
  });

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!member) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Member not found",
    });
  }

  const access = await prisma.access.findFirst({
    where: {
      userId: member.id,
      projectId,
    },

    select: {
      role: true,
    },
  });

  if (!access) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Member doese not have access to this project.",
    });
  }

  if (!project) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Project not found",
    });
  }

  const token = randomBytes(32).toString("hex");
  const SEVEN_DAYS_IN_SECONDS = 60 * 60 * 24 * 7;
  const expires = new Date(Date.now() + SEVEN_DAYS_IN_SECONDS * 1000);

  await prisma.verificationToken.create({
    data: {
      identifier: member.email,
      token: hashToken(token),
      expires,
    },
  });

  const params = new URLSearchParams({
    callbackUrl: `${process.env.NEXTAUTH_URL}/projects`,
    email: member.email,
    token,
  });

  const url = `${process.env.NEXTAUTH_URL}/api/auth/callback/email?${params}`;

  console.log(`Sending invitation email to ${member.email} with otp ${otp}`);

  await sendMail({
    subject: `Invitation to join ${project?.name} on Envless`,
    to: member.email,
    component: (
      <MagicLink
        headline={`Invitation to join ${project?.name} on Envless`}
        greeting={`Hi there,`}
        body={
          <>
            You have been invited to join the project <b>{project?.name}</b> on
            Envless. Please copy this one-time password and click the button
            below to accept the invitation.
            <br />
            <br />
            <code>
              <pre>{otp}</pre>
            </code>
          </>
        }
        subText="Please note that this invitation link will expire in 7 days"
        buttonText={`Join ${project?.name}`}
        buttonLink={url}
      />
    ),
  });

  await Audit.create({
    projectId,
    createdById: fromId,
    action: reinvite ? "invite.updated" : "invite.created",
    data: {
      invite: {
        id: toId,
        email: member.email,
        role: access.role,
      },
    },
  });

  return {
    message: `We have successfully invited ${member.email} to join ${project?.name}.`,
  };
};
