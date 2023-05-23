-- AlterEnum
ALTER TYPE "PullRequestStatus" ADD VALUE 'reOpened';

-- AlterTable
ALTER TABLE "PullRequest" ADD COLUMN     "reOpenedAt" TIMESTAMP(3),
ADD COLUMN     "reOpenedById" TEXT;

-- CreateIndex
CREATE INDEX "PullRequest_reOpenedById_idx" ON "PullRequest"("reOpenedById");
