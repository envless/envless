import type { MemberType } from "@/types/resources";
import { MembershipStatus } from "@prisma/client";
import prisma from "@/lib/prisma";

const getOne = async (id: string) => {
  const member = await prisma.user.findUnique({
    where: { id },
  });

  return member;
};

const getMany = async (
  projectId: string,
  status: MembershipStatus = MembershipStatus.active,
): Promise<MemberType[]> => {
  const accesses = await prisma.access.findMany({
    where: {
      projectId,
      status: status ?? MembershipStatus.active,
    },
    include: {
      user: true,
      projectInvite: true,
    },
    orderBy: {
      createdAt: "asc",
    },
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
    };
  });
};

const Member = {
  getOne,
  getMany,
};

export default Member;
