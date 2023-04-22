import prisma from "@/lib/prisma";

export const accessesWithProject = async ({ userId }: { userId: string }) => {
  const access = await prisma.access.findMany({
    where: {
      // @ts-ignore
      userId,
      project: {
        deletedAt: null,
      },
    },
    select: {
      id: true,
      role: true,
      status: true,
      project: {
        select: {
          id: true,
          name: true,
          slug: true,
          updatedAt: true,
        },
      },
    },
  });

  return access;
};
