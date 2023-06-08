import type { MemberType } from "@/types/resources";
import { QUERY_ITEMS_PER_PAGE } from "@/lib/constants";
import prisma from "@/lib/prisma";

const getOne = async (id: string) => {
  const member = await prisma.user.findUnique({
    where: { id },
  });

  return member;
};

const getMany = async (projectId: string): Promise<MemberType[]> => {
  const accesses = await prisma.access.findMany({
    where: {
      projectId,
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: QUERY_ITEMS_PER_PAGE,
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
    };
  });
};

const Member = {
  getOne,
  getMany,
};

export default Member;
