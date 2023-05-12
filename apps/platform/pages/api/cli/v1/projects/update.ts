import { NextApiResponse } from "next";
import withCliAuth, { NextCliApiRequest } from "@/utils/withCliAuth";
import prisma from "@/lib/prisma";

const update = async (req: NextCliApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { id } = req.query;
    const { user } = req;
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
  }
};

export default withCliAuth(update);
