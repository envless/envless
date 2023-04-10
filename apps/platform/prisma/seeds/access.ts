import { PrismaClient } from "@prisma/client";
import colors from "colors";
import { sample } from "lodash";
import { AccessType, AuditType } from "./types";

const prisma = new PrismaClient();

colors.enable();

const seedAccesses = async () => {
  const audits: AuditType[] = [];
  const accesses: AccessType[] = [];

  const users = await prisma.user.findMany({
    select: { id: true },
  });

  const projects = await prisma.project.findMany({
    select: { id: true },
  });

  const projectOwner = {};

  for (const project of projects) {
    projectOwner[project.id] = sample(users)?.id;
  }

  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < projects.length; j++) {
      const user = users[i];
      const project = projects[j];
      const role =
        projectOwner[project.id] === user.id
          ? "owner"
          : (sample([
              "maintainer",
              "developer",
              "guest",
            ]) as AccessType["role"]);

      const status =
        projectOwner[project.id] === user.id ? "active" : "inactive";

      accesses.push({
        userId: user.id as string,
        projectId: project.id as string,
        role,
        status,
      });

      if (role === "owner") {
        audits.push({
          createdById: user.id,
          projectId: project.id,
          action: "project.created",
        });
      }

      audits.push({
        createdById: projectOwner[project.id],
        createdForId: user.id,
        projectId: project.id,
        action: "access.created",
        data: {
          access: { role },
        },
      });
    }
  }

  console.log(`Seeding ${accesses.length} accesses`.blue);

  const records = await prisma.access.createMany({
    data: accesses,
    skipDuplicates: true,
  });
  await prisma.audit.createMany({ data: audits, skipDuplicates: true });

  console.log(`🎉 Seeded ${records.count} accesses`.green);
  return records;
};

export default seedAccesses;
