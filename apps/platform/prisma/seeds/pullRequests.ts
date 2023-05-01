import { getNextPrId } from "@/models/pullRequest";
import { faker } from "@faker-js/faker";
import { PrismaClient, PullRequest } from "@prisma/client";
import colors from "colors";
import { sample } from "lodash";
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

  const branches = await prisma.branch.findMany({ select: { id: true } });

  console.log(`Seeding Pull Requests for ${projects.length} projects`.blue);

  for (let j = 0; j < projects.length; j++) {
    const baseBranchId = sample([
      ...branches.map((branch) => branch.id),
    ]) as string;

    let currentBranchId = baseBranchId;

    while (currentBranchId === baseBranchId) {
      currentBranchId = sample([
        ...branches.map((branch) => branch.id),
      ]) as string;
    }

    pullRequests.push({
      title: `${faker.lorem.sentence(10)}`,
      prId: await getNextPrId(projects[j].id),
      status: sample([
        "open",
        "closed",
        "merged",
      ]) as unknown as PullRequestStatusType,
      baseBranchId,
      currentBranchId,
      projectId: projects[j].id,
      createdById: sample([...users.map((user) => user.id)]) as string,
    });
  }

  const records = await prisma.pullRequest.createMany({
    data: pullRequests as unknown as PullRequest[],
  });

  console.log(`🎉 Seeded ${records.count} pull requests`.green);
};

export default seedPullRequests;
