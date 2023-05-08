-- CreateTable
CREATE TABLE "PullRequestHistory" (
    "id" TEXT NOT NULL,
    "encryptedKey" TEXT NOT NULL,
    "encryptedValue" TEXT NOT NULL,
    "baseBranchId" TEXT NOT NULL,
    "currentBranchId" TEXT NOT NULL,
    "pullRequestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PullRequestHistory_pkey" PRIMARY KEY ("id")
);
