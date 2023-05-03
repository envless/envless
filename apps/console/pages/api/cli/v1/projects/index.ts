import type { NextApiResponse } from "next";
import { createProject, getProjects } from "@/utils/api/projects.controller";
import withCliAuth, { type NextCliApiRequest } from "@/utils/withCliAuth";

/**
 * @swagger
 * /api/cli/v1/projects:
 *  get:
 *    description: Get all projects
 *    responses:
 *      200:
 *        description: Success
 *    content:
 *        application/json:
 *          schema:
 *            type: array
 *            projects:
 *              type: object
 *              properties:
 *                id: string
 *                name: string
 *    post:
 *      description: Create a new project
 *      responses:
 *        200:
 *          description: Success
 */

const projects = async (req: NextCliApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    getProjects(req, res);
    return;
  }

  if (req.method === "POST") {
    createProject(req, res);
    return;
  }

  return res.status(404).json({ message: "Not found" });
};

export default withCliAuth(projects);
