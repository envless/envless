/*
  Warnings:

  - Changed the type of `prId` on the `PullRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "PullRequest" DROP COLUMN "prId",
ADD COLUMN     "prId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "PullRequest_createdAt_idx" ON "PullRequest"("createdAt");

-- CreateIndex
CREATE INDEX "PullRequest_projectId_prId_idx" ON "PullRequest"("projectId", "prId");

-- CreateIndex
CREATE UNIQUE INDEX "PullRequest_prId_projectId_key" ON "PullRequest"("prId", "projectId");
