import type { NextApiResponse } from "next";
import {
  ACCESS_CREATED,
  BRANCH_CREATED,
  PROJECT_CREATED,
} from "@/types/auditActions";
import withCliAuth, { type NextCliApiRequest } from "@/utils/withCliAuth";
import { Access, Branch, Project } from "@prisma/client";
import { kebabCase } from "lodash";
import Audit from "@/lib/audit";
import prisma from "@/lib/prisma";

type ErrorMessage = {
  message?: string;
};

type NewProjectResponse = {
  name: string;
  slug: string;
  createdAt: Date;
};

const createEnvlessProject = async (
  project: { name: string; slug: string },
  { user }: NextCliApiRequest,
) => {
  const newProject = await prisma.project.create({
    data: {
      name: project.name,
      slug: kebabCase(project.slug),
      access: {
        create: {
          userId: user.id,
          role: "owner",
        },
      },
      branches: {
        create: {
          name: "main",
          protected: true,
          description: "Main branch is protected by default",
          protectedAt: new Date(),
          createdById: user.id,
        },
      },
    },

    include: {
      access: true,
      branches: true,
    },
  });

  if (newProject.id) {
    await Audit.create({
      createdById: user.id,
      projectId: newProject.id,
      action: PROJECT_CREATED,
      data: {
        project: {
          id: newProject.id,
          name: newProject.name,
        },
      },
    });

    // @ts-ignore
    const access = newProject.access[0];
    // @ts-ignore
    const branch = newProject.branches[0];

    await Audit.create({
      createdById: user.id,
      createdForId: user.id,
      projectId: newProject.id,
      action: ACCESS_CREATED,
      data: {
        access: {
          id: access.id,
          role: access.role,
        },
      },
    });

    await Audit.create({
      createdById: user.id,
      projectId: newProject.id,
      action: BRANCH_CREATED,
      data: {
        branch: {
          id: branch.id,
          name: branch.name,
        },
      },
    });
  }

  return newProject;
};

const create = async (
  req: NextCliApiRequest,
  res: NextApiResponse<NewProjectResponse | ErrorMessage>,
) => {
  if (req.method != "POST") {
    return res.status(404).json({ message: "Not found" });
  }

  //   Project Info
  const projectName = req.body.name as string;
  const projectSlug = req.body.slug as string;

  if (!projectName || !projectSlug) {
    res.status(400).json({
      message: "Params to create project is not complete",
    } as ErrorMessage);
    return;
  }

  try {
    const newProject = await createEnvlessProject(
      { name: projectName, slug: projectSlug },
      req,
    );
    if (newProject) {
      res.status(200).json({
        name: newProject.name,
        slug: newProject.slug,
        createdAt: newProject.createdAt,
      });
    }
  } catch (e: any) {
    res.status(400).json(e);
  }
  return;
};

export default withCliAuth(create);
