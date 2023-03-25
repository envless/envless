import { Project as ProjectType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import prisma from "@/lib/prisma";

const findBySlug = async (slug: string) => {
  const project = await prisma.project.findFirst({
    where: {
      slug,
    },
  });

  if (!project) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "The project does not exist",
    });
  }

  return project;
};

const deleteProject = async ({
  softDelete = true,
  id,
}: {
  id: string;
  softDelete: boolean;
}) => {
  let deletedProject: ProjectType | null = null;

  if (softDelete) {
    deletedProject = await prisma.project.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  } else {
    deletedProject = await prisma.project.delete({
      where: {
        id,
      },
    });
  }

  return deletedProject;
};

const Project = {
  findBySlug,
  deleteProject,
};

export default Project;
