import { NextApiResponse } from "next";
import { NextCliApiRequest } from "@/utils/withCliAuth";
import prisma from "@/lib/prisma";
import { Data } from "../types";

export const getProjects = async (
  req: NextCliApiRequest,
  res: NextApiResponse<Data>,
) => {
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
