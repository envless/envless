import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import colors from "colors";
import { ProjectType } from "./types";
import { kebabCase } from "lodash";

const prisma = new PrismaClient();

colors.enable();

const seedProjects = async (count: number = 10) => {
  const projects: ProjectType[] = [];

  for (let i = 0; i < count; i++) {
    const name = faker.company.name();
    let slug = `${kebabCase(name)}-${Date.now()}`;

    projects.push({
      name,
      slug
    });
  }

  console.log(`Seeding ${projects.length} project`.blue);

  const records = await prisma.project.createMany({
    data: projects,
  });

  console.log(`🎉 Seeded ${records.count} projects`.green);
  return records;
};

export default seedProjects;
