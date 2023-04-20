import type { NextApiResponse } from "next";
import withCliAuth, { type NextCliApiRequest } from "@/utils/withCliAuth";
import prisma from "@/lib/prisma";

/**
 * @swagger
 * /api/cli/v1/projects/{id}/secrets:
 *  get:
 *    description: Get all secrets for a project
 *    responses:
 *      200:
 *        description: Success
 *    content:
 *        application/json:
 *          schema:
 *            type: array
 *            secrets:
 *              type: object
 *              properties:
 *                encryptedKey: string
 *                encryptedValue: string
 */

const secrets = async (req: NextCliApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { id, branch } = req.query;
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

    // TODO: Uncomment this line after https://github.com/envless/envless/issues/395 is closed.
    // if (!projectAccess || projectAccess.status !== "active") {
    if (!projectAccess) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const encryptedProjectKey = await prisma.encryptedProjectKey.findUnique({
      where: {
        projectId: id as string,
      },
      select: {
        encryptedKey: true,
      },
    });

    const branchRecord = await prisma.branch.findUnique({
      where: {
        name_projectId: {
          projectId: id as string,
          name: branch as string,
        },
      },
      select: {
        id: true,
        secrets: {
          select: {
            id: true,
            encryptedKey: true,
            encryptedValue: true,
          },
        },
      },
    });

    return res.status(200).json({
      encryptedSecrets: branchRecord?.secrets,
      encryptedProjectKey: encryptedProjectKey?.encryptedKey,
    });
  }

  return res.status(404).json({ message: "Not found" });
};

export default withCliAuth(secrets);
