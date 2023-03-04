import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import colors from "colors";
import { randomBytes } from "crypto";
import { sub } from "date-fns";
import { random } from "lodash";
import generatePassword from "omgopass";
import { ProjectInviteType } from "./types";

const prisma = new PrismaClient();
colors.enable();

const seedInvites = async (count: number = 10) => {
  console.log(`Seeding ${count} invites for each project.`.blue);

  const projects = await prisma.project.findMany({
    select: { id: true },
  });

  const inviteArray: ProjectInviteType[] = [];

  projects.forEach(async (project) => {
    for (let i = 0; i < count; i++) {
      const invitationToken = randomBytes(32).toString("hex");
      const password = await generatePassword();
      const hashedPassword = await argon2.hash(password);
      const createdAt = sub(new Date(), {
        days: random(1, 30),
      });

      inviteArray.push({
        email: faker.internet.email(),
        projectId: project.id,
        invitationToken,
        hashedPassword,
        createdAt,
      });
    }
  });

  const records = await prisma.projectInvite.createMany({
    data: inviteArray,
  });

  console.log(`🎉 Seeded ${count} invites for each project.`.green);
};

export default seedInvites;
