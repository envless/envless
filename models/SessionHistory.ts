import prisma from "@/lib/prisma";

const getOne = async (id: string) => {
  const session = await prisma.sessionHistory.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });

  return session;
};

const create = async (data: {
  userId: string;
  ip?: string;
  os?: object;
  device?: object;
  client?: object;
  bot?: object;
  city?: string;
  region?: string;
  country?: string;
}) => {
  const session = await prisma.sessionHistory.create({
    data: data,
  });

  return session;
};

const update = async (id: string, data: any) => {
  const session = await prisma.sessionHistory.update({
    where: {
      id,
    },
    data: data,
  });

  return session;
};

const SessionHistory = {
  getOne,
  create,
  update,
};

export default SessionHistory;
