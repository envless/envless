import type { NextApiResponse } from "next";
import { getProjects } from "@/utils/api/projects";
import { createProject } from "@/utils/api/projects/create";
import withCliAuth, { type NextCliApiRequest } from "@/utils/withCliAuth";

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
