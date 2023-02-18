import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSideSession } from "@/utils/session";
import prisma from "@/lib/prisma";

export default async function acceptIvnite(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { invitationToken } = req.query;
  const session = await getServerSideSession({ req, res });
  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const invite = await prisma.projectInvite.findUnique({
    where: {
      invitationToken: invitationToken as string,
    },
  });

  if (!invite || invite.expires < new Date()) {
    return res
      .status(404)
      .json({ message: "Invitation is expired or invalid" });
  }

  // find or create access
  await prisma.access.upsert({
    where: {
      userId_projectId: {
        userId: session.user.id,
        projectId: invite.projectId,
      },
    },
    update: {},
    create: {
      userId: session.user.id,
      role: invite.role,
      projectId: invite.projectId,
    },
  });

  await prisma.projectInvite.delete({
    where: {
      invitationToken: invitationToken as string,
    },
  });

  return res.redirect(`/projects/${invite.projectId}`);
}
