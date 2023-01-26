import prisma from "@/lib/prisma";

const getOne = async (id: string) => {
  const session = await prisma.session.findUnique({
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
  ip: string;
  os: object;
  browser: object;
  device: object;
  bot: boolean;
  city: string;
  region: string;
  country: string;
}) => {
  const session = await prisma.session.create({
    data: data,
  });

  return session;
};

const Session = {
  getOne,
  create,
};

export default Session;
