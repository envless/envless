import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import colors from "colors";
import { randomBytes } from "crypto";
import { addHours, sub } from "date-fns";
import { random, sample, toLower } from "lodash";
import type { AccessType, ProjectInviteType } from "./types";

const prisma = new PrismaClient();
colors.enable();

const seedInvites = async (count: number = 10) => {
  console.log(`Seeding ${count} invites for each project.`.blue);

  const projects = await prisma.project.findMany({
    select: { id: true },
  });

  const password = await randomBytes(32).toString("hex");
  const hashedPassword = await argon2.hash(password);

  for (const project of projects) {
    for (let i = 0; i < count; i++) {
      const invitationToken = randomBytes(32).toString("hex");
      const createdAt = sub(new Date(), {
        days: random(1, 30),
      });

      const expiresAt = addHours(createdAt, random(0, 48));

      const projectInvite = await prisma.projectInvite.create({
        data: {
          projectId: project.id,
          invitationToken,
          invitationTokenExpiresAt: expiresAt,
          hashedPassword,
          createdAt,
        },
      });

      const user = await prisma.user.create({
        data: {
          email: faker.internet.email(),
          name: faker.name.fullName(),
        },
      });

      await prisma.access.create({
        data: {
          user: { connect: { id: user.id } },
          project: { connect: { id: project.id } },
          projectInvite: { connect: { id: projectInvite.id } },
          role: sample([
            "maintainer",
            "developer",
            "guest",
          ]) as AccessType["role"],
          status: "pending",
        },
      });
    }
  }

  console.log(`🎉 Seeded invites for ${projects.length} projects.`.green);
};

export default seedInvites;
