// POST /api/v1/projects

import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * The data type for the API response.
 *
 * @typedef {Object} Data
 * @property {Object} data - The data to be returned in the response.
 * @property {string} data.workspace - The name of the workspace created.
 */

/**
 * The API route handler for creating a new project.
 *
 * @param {NextApiRequest} req - The Next.js API request.
 * @param {NextApiResponse} res - The Next.js API response.
 * @returns {Promise<void>}
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await unstable_getServerSession(req, res, authOptions)

  if (!session || !session.user){
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const currentUser = session.user;
  const userId = currentUser?.id

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const body = JSON.parse(req.body)
  const { workspace, project } = body

  const space = await prisma.workspace.create({
    data: {
      name: workspace,
      users: {
        connect: {
          id: userId,
        },
      },
      projects: {
        create: {
          name: project
        }
      },
    },
  })

  console.log({ workspace })
  // return res.status(201).json({ workspace: workspace });
  return res.status(201).json({ workspace: {} });
}

