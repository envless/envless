import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import colors from "colors";
import { kebabCase, sample } from "lodash";
import { ProjectType } from "./types";

const prisma = new PrismaClient();

colors.enable();

const seedProjects = async (count: number = 10) => {
  const projects: ProjectType[] = [];
  const names = [
    "Next JS API",
    "GraphQL API",
    "Blog",
    "Docs",
    "Monolithic Server",
  ];

  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    let slug = `${kebabCase(name)}-${Date.now()}`;

    projects.push({
      name,
      slug,
    });
  }

  console.log(`Seeding ${projects.length} project`.blue);

  const records = await prisma.project.createMany({
    data: projects,
  });

  const user = await prisma.user.findUnique({
    where: {
      email: "envless@example.com",
    },
  });

  const projectRecords = await prisma.project.findMany();

  const accesses = projectRecords.map((project) => ({
    userId: user?.id as string,
    projectId: project.id as string,
    role: "owner" as any,
    status: "active" as any,
  }));

  await prisma.access.createMany({
    data: accesses,
  });

  console.log(`🎉 Seeded ${records.count} projects`.green);
  return records;
};

export default seedProjects;
