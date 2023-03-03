import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import colors from "colors";
import { ProjectType } from "./types";

const prisma = new PrismaClient();

colors.enable();

const createProjects = async (count: number = 10) => {
  const projects: ProjectType[] = [];

  for (let i = 0; i < count; i++) {
    projects.push({
      name: faker.company.name(),
    });
  }

  console.log(`Seeding ${projects.length} project`.blue);

  const records = await prisma.project.createMany({
    data: projects,
  });

  console.log(`🎉 Seeded ${records.count} projects`.green);
  return records;
};

export default createProjects;
