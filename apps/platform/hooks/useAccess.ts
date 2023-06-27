import { MembershipStatus, UserRole } from "@prisma/client";
import prisma from "@/lib/prisma";

interface Props {
  userId: string;
  projectId: string;
}

const useAccess = async ({ userId, projectId }: Props) => {
  const access = await prisma.access.findUnique({
    where: {
      userId_projectId: { userId, projectId },
    },
    select: {
      role: true,
      status: true,
    },
  });

  const hasAccess =
    access &&
    access.status === MembershipStatus.active &&
    [UserRole.owner, UserRole.maintainer].includes(
      access.role as "owner" | "maintainer",
    );

  return hasAccess;
};

export default useAccess;
