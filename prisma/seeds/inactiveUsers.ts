import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import colors from "colors";
import { sample } from "lodash";
import { AccessType, UserType } from "./types";

const prisma = new PrismaClient();
colors.enable();

const seedInactiveUsers = async (count: number = 10) => {
  console.log(`Seeding ${count} inactive members for each project.`.blue);
  const projects = await prisma.project.findMany({
    select: { id: true },
  });

  const userArray: UserType[] = [];

  for (let i = 0; i < count; i++) {
    userArray.push({
      name: faker.name.fullName(),
      email: faker.internet.email(),
    });
  }

  await prisma.user.createMany({
    data: userArray,
  });

  const users = await prisma.user.findMany({
    where: {
      email: {
        in: userArray.map((user) => user.email),
      },
    },
    select: {
      id: true,
    },
  });

  const accessArray: AccessType[] = [];

  projects.forEach((project) => {
    users.forEach((user) => {
      accessArray.push({
        projectId: project.id,
        userId: user.id,
        role: sample([
          "maintainer",
          "developer",
          "guest",
        ]) as AccessType["role"],
        active: false,
      });
    });
  });

  const records = await prisma.access.createMany({
    data: accessArray,
  });

  console.log(`🎉 Seeded ${count} inactive members for each project.`.green);
};

export default seedInactiveUsers;
