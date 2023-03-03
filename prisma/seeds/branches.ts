import { faker } from "@faker-js/faker";
import { Branch, PrismaClient } from "@prisma/client";
import colors from "colors";
import { parseInt, random } from "lodash";
import { BranchType } from "./types";

const prisma = new PrismaClient();

colors.enable();

const seedBranches = async () => {
  const branches: BranchType[] = [];

  const projects = await prisma.project.findMany({
    select: { id: true },
  });

  const users = await prisma.user.findMany({
    select: { id: true },
  });

  console.log(`Seeding branches for ${projects.length} projects`.blue);

  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < projects.length; j++) {
      branches.push({
        name: `${faker.git.branch()}-${random(1, 5000)}`,
        projectId: projects[j].id,
        protected: j >= parseInt(String(projects.length / 2)) ? true : false,
        createdById: users[i].id,
      });
    }
  }

  const records = await prisma.branch.createMany({
    data: branches as Branch[],
  });

  console.log(`🎉 Seeded ${records.count} branches`.green);
};

export default seedBranches;
