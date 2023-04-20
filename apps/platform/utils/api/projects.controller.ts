import type { NextApiResponse } from "next";
import {
  ACCESS_CREATED,
  BRANCH_CREATED,
  PROJECT_CREATED,
} from "@/types/auditActions";
import { kebabCase } from "lodash";
import Audit from "@/lib/audit";
import prisma from "@/lib/prisma";
import { NextCliApiRequest } from "../withCliAuth";

type ErrorMessage = {
  message?: string;
};

type NewProjectResponse = {
  name: string;
  slug: string;
  createdAt: Date;
};

type Data = {
  id?: string;
  name?: string;
  message?: string;
};

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

export const createProject = async (
  req: NextCliApiRequest,
  res: NextApiResponse<NewProjectResponse | ErrorMessage>,
) => {
  if (req.method != "POST") {
    return res.status(404).json({ message: "Not found" });
  }

  //   Project Info
  const projectName = req.body.name as string;

  if (!projectName) {
    res.status(400).json({
      message: "Params to create project is not complete",
    } as ErrorMessage);
    return;
  }

  const projectSlug = kebabCase(projectName);

  try {
    const newProject = await createEnvlessProject(
      { name: projectName, slug: projectSlug },
      req,
      res,
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

export const doesProjectConflict = async (name: string, slug: string) => {
  const project = await prisma.project.findFirst({
    where: {
      OR: [
        {
          name,
        },
        { slug },
      ],
    },
  });
  if (project) {
    const conflictField = project.slug === slug ? "slug" : "name";
    if (conflictField == "slug") {
      const newSlug = `${slug}-${Date.now()}`;
      doesProjectConflict(name, newSlug);
    }
    return { conflictField, project: { name, slug } };
  } else if (project === null) {
    return { conflictField: null, project: { name, slug } };
  }
};

const createEnvlessProject = async (
  project: { name: string; slug: string },
  { user }: NextCliApiRequest,
  res: NextApiResponse,
) => {
  const checkConflict = await doesProjectConflict(project.name, project.slug);
  if (checkConflict?.conflictField) {
    res.status(409).json({
      message: `Project with name ${checkConflict.project.name} already exists`,
    });
    return false;
  }
  if (!checkConflict?.conflictField && checkConflict?.project) {
    const newProject = await prisma.project.create({
      data: {
        name: checkConflict.project.name,
        slug: checkConflict.project.slug,
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
  }
};
