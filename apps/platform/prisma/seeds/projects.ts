import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import colors from "colors";
import { kebabCase, sample } from "lodash";
import { ProjectType } from "./types";

const prisma = new PrismaClient();

colors.enable();

const seedProjects = async (count: number = 10) => {
  const projects: ProjectType[] = [];

  for (let i = 0; i < count; i++) {
    const name = `${faker.random.words(2)} ${sample([
      "Inc.",
      "LLC",
      "LTD.",
      "Co.",
    ])}`;
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

  console.log(`🎉 Seeded ${records.count} projects`.green);
  return records;
};

export default seedProjects;
