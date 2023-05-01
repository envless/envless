import prisma from "@/lib/prisma";

export const getNextPrId = async (projectId: string) => {
  const pullRequestWithLatestPrId = await prisma.pullRequest.findFirst({
    select: {
      prId: true,
    },
    where: {
      projectId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return pullRequestWithLatestPrId?.prId
    ? pullRequestWithLatestPrId.prId + 1
    : 1;
};

export const getOne = async ({
  prId,
  projectId,
}: {
  projectId: string;
  prId: number;
}) => {
  return await prisma.pullRequest.findUnique({
    where: {
      prId_projectId: {
        prId,
        projectId,
      },
    },
    select: {
      createdBy: true,
      currentBranchId: true,
      baseBranchId: true,
      prId: true,
    },
  });
};
