import { NextApiRequest, NextApiResponse } from "next";
import withCliAuth, { NextCliApiRequest } from "@/utils/withCliAuth";
import prisma from "@/lib/prisma";

type updateRequestData = Partial<{
  [key: string]: boolean | string | string[];
}>;

const update = async (req: NextCliApiRequest, res: NextApiResponse) => {
  if (req.method != "POST") {
    // Any order request aside the POST request
    res.status(405).json({
      message: "Method not allowed",
    });
  }

  const { id, name, newName, twoFactorRequired } =
    req.body as updateRequestData;

  const { user } = req;

  if (!id && !name) {
    return res.status(400).json({ message: "project ID or name required" });
  }

  if (!newName) {
    return res.status(400).json({ message: "specify new project name" });
  }

  const projectAccess = await prisma.access.findUnique({
    where: {
      userId_projectId: {
        userId: user.id,
        projectId: id as string,
      },
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!projectAccess) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const updatedProject = await prisma.project.update({
    where: {
      id: id as string,
    },
    data: {
      name: newName as string,
      twoFactorRequired: (twoFactorRequired as boolean) || false,
    },
  });

  if (updatedProject) {
    return res.status(200).json(updatedProject);
  }

  return res
    .status(400)
    .json({ message: "an error occured while trying to update project" });
};

export default withCliAuth(update);
