import prisma from "@/lib/prisma";

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
  createdForId?: string;
  projectId: any;
  limit?: number;
  skip?: number;
}

const logs = async ({
  createdById,
  createdForId,
  projectId,
  limit,
  skip,
}: LogInterface) => {
  const audits = await prisma.audit.findMany({
    where: {
      AND: [
        { projectId: { in: projectId } },
        ...(createdById ? [{ createdById }] : []),
        ...(createdForId ? [{ createdForId }] : []),
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
