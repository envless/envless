import type { NextApiResponse } from "next";
import withCliAuth, { type NextCliApiRequest } from "@/utils/withCliAuth";
import prisma from "@/lib/prisma";

type Data = {
  id?: string;
  name?: string;
  message?: string;
};

const projects = async (req: NextCliApiRequest, res: NextApiResponse<Data>) => {
  if (req.method != "GET") {
    return res.status(404).json({ message: "Not found" });
  }

  const user = req.user;
  const access = await prisma.access.findMany({
    where: {
      userId: user.id,
    },
    select: {
      projectId: true,
    },
  });

  const projectIds = access.map((a) => a.projectId);

  const projects = await prisma.project.findMany({
    where: {
      id: {
        in: projectIds,
      },
      deletedAt: null,
    },

    select: {
      id: true,
      name: true,
    },
  });

  return res.status(200).json(projects as Data);
};

export default withCliAuth(projects);
