import prisma from "@/lib/prisma";

const getOne = async (id: string) => {
  const member = await prisma.user.findUnique({
    where: { id },
  });

  return member;
};

const getMany = async (projectId: string, active: boolean = true) => {
  const accesses = await prisma.access.findMany({
    where: {
      projectId,
      active: active ?? true,
    },
    include: {
      user: true,
    },
  });

  return accesses.map((access) => {
    return {
      id: access.user.id,
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
