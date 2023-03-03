import prisma from "./prisma";

interface CreateInterface {
  createdById: string;
  createdForId?: string;
  projectId?: string;
  action: string;
  data?: any;
}

const create = async ({
  createdById,
  createdForId,
  projectId,
  action,
  data,
}: CreateInterface) => {
  const audit = await prisma.audit.create({
    data: {
      createdById,
      createdForId,
      projectId,
      action,
      ...(data ? { data } : {}),
    },
  });

  return audit;
};

interface LogInterface {
  createdById?: string;
  projectIds: any;
  actions?: any;
  limit?: number;
  skip?: number;
}

const logs = async ({
  createdById,
  projectIds,
  actions,
  limit,
  skip,
}: LogInterface) => {
  const audits = await prisma.audit.findMany({
    where: {
      OR: [
        { projectId: { in: projectIds } },
        ...(actions && createdById
          ? [{ action: { in: actions }, createdById: { in: [createdById] } }]
          : []),
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
    ...(skip ? { skip } : {}),
  });

  return audits;
};

const Audit = {
  logs,
  create,
};

export default Audit;
