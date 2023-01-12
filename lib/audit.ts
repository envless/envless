import prisma from "@/lib/prisma";

interface CreateInterface {
  createdById: string;
  createdForId?: string;
  projectId?: string;
  action: string;
  data: any;
}

interface LogInterface {
  createdById: string;
  projectId?: string;
  limit?: number;
}

const create = async ({ createdById, createdForId, projectId, action, data }: CreateInterface) => {
  const audit = await prisma.audit.create({
    data: {
      createdById,
      createdForId,
      projectId,
      action,
      data,
    },
  });

  return audit;
};

const logs = async ({ createdById, projectId, limit }: LogInterface) => {
  const audits = await prisma.audit.findMany({
    where: {
      AND: [
        { createdById: { equals: createdById } },
        ...(projectId ? [{ projectId: { equals: projectId } }] : []),
      ],
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      createdFor: {
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
