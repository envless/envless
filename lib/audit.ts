import prisma from "@/lib/prisma";

interface CreateInterface {
  userId: string;
  projectId?: string;
  event: string;
  data: any;
}

interface LogInterface {
  userId: string;
  projectId?: string;
  limit?: number;
}

const create = async ({ userId, projectId, event, data }: CreateInterface) => {
  const audit = await prisma.audit.create({
    data: {
      userId,
      projectId,
      event,
      data,
    },
  });

  return audit;
};

const logs = async ({ userId, projectId, limit }: LogInterface) => {
  const audits = await prisma.audit.findMany({
    where: {
      AND: [
        { userId: { equals: userId } },
        ...(projectId ? [{ projectId: { equals: projectId } }] : []),
      ],
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    ...(limit ? { take: limit } : {}),
  });

  return audits;
};

const Audit = {
  logs,
  create,
};

export default Audit;
