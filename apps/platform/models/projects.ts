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

const Project = {
  findBySlug,
};

export default Project;
