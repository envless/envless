import prisma from "@/lib/prisma";

export const getNextPrId = async (projectId: string) => {
  const pullRequestWithLatestPrId = await prisma.pullRequest.findFirst({
    select: {
      prId: true,
    },
    where: {
      projectId: projectId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return pullRequestWithLatestPrId?.prId
    ? pullRequestWithLatestPrId.prId + 1
    : 1;
};
