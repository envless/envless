import { UserType } from "@/types/resources";
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
