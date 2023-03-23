import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import colors from "colors";
import { UserType } from "./types";

const prisma = new PrismaClient();

colors.enable();

const seedUsers = async (count: number = 10) => {
  const users: UserType[] = [
    {
      name: faker.name.fullName(),
      email: "envless@example.com",
    },
  ];

  for (let i = 0; i < count; i++) {
    users.push({
      name: faker.name.fullName(),
      email: faker.internet.email(),
    });
  }

  console.log(`Seeding ${users.length} users`.blue);

  const records = await prisma.user.createMany({
    data: users,
  });

  console.log(`🎉 Seeded ${records.count} users`.green);
  return records;
};

export default seedUsers;
