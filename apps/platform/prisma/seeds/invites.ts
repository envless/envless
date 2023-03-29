import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import colors from "colors";
import { randomBytes } from "crypto";
import { addHours, sub } from "date-fns";
import { random, sample, toLower } from "lodash";
import generatePassword from "omgopass";
import type { AccessType, ProjectInviteType } from "./types";

const prisma = new PrismaClient();
colors.enable();

const seedInvites = async (count: number = 10) => {
  console.log(`Seeding ${count} invites for each project.`.blue);

  const projects = await prisma.project.findMany({
    select: { id: true },
  });

  const inviteArray: ProjectInviteType[] = [];
  const password = await generatePassword();
  const hashedPassword = await argon2.hash(password);

  projects.forEach((project) => {
    for (let i = 0; i < count; i++) {
      const invitationToken = randomBytes(32).toString("hex");
      const createdAt = sub(new Date(), {
        days: random(1, 30),
      });

      const expiresAt = addHours(createdAt, random(0, 48));

      inviteArray.push({
        email: toLower(faker.internet.email()),
        role: sample([
          "maintainer",
          "developer",
          "guest",
        ]) as AccessType["role"],
        projectId: project.id,
        invitationToken,
        invitationTokenExpiresAt: expiresAt,
        hashedPassword,
        createdAt,
      });
    }
  });

  const records = await prisma.projectInvite.createMany({
    data: inviteArray,
    skipDuplicates: true,
  });

  console.log(`🎉 Seeded ${records.count} invites.`.green);
};

export default seedInvites;
