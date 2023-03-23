-- CreateEnum
CREATE TYPE "PullRequestStatus" AS ENUM ('open', 'merged', 'closed');

-- CreateTable
CREATE TABLE "PullRequest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "prNumber" TEXT NOT NULL,
    "status" "PullRequestStatus" NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "mergedById" TEXT,
    "closedById" TEXT,
    "baseBranchId" TEXT,
    "currentBranchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mergedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "PullRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PullRequest_projectId_status_idx" ON "PullRequest"("projectId", "status");

-- CreateIndex
CREATE INDEX "PullRequest_projectId_prNumber_idx" ON "PullRequest"("projectId", "prNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PullRequest_prNumber_projectId_key" ON "PullRequest"("prNumber", "projectId");
