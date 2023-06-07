import MagicLink from "@/emails/MagicLink";
import { UserType } from "@/types/resources";
import { User } from "@prisma/client";
import { createHash, randomBytes } from "crypto";
import sendMail from "emails";
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
