import { faker } from "@faker-js/faker";
import { PrismaClient, PullRequest } from "@prisma/client";
import colors from "colors";
import { parseInt, random, sample } from "lodash";
import { PullRequestStatusType, PullRequestType } from "./types";

const prisma = new PrismaClient();

colors.enable();

const seedPullRequests = async () => {
  const pullRequests: PullRequestType[] = [];

  const projects = await prisma.project.findMany({
    select: { id: true },
  });

  const users = await prisma.user.findMany({
    select: { id: true },
  });

  console.log(`Seeding Pull Requests for ${projects.length} projects`.blue);

  let prCounter = 1;

  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < projects.length; j++) {
      pullRequests.push({
        title: `${faker.lorem.sentence(10)}`,
        prId: `#${prCounter}`,
        status: sample([
          "open",
          "closed",
          "merged",
        ]) as unknown as PullRequestStatusType,
        projectId: projects[j].id,
        createdById: users[i].id,
      });

      prCounter++;
    }
  }

  const records = await prisma.pullRequest.createMany({
    data: pullRequests as unknown as PullRequest[],
  });

  console.log(`🎉 Seeded ${records.count} pull requests`.green);
};

export default seedPullRequests;
