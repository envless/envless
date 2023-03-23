/*
  Warnings:

  - You are about to drop the column `prNumber` on the `PullRequest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[prId,projectId]` on the table `PullRequest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `prId` to the `PullRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PullRequest_prNumber_projectId_key";

-- DropIndex
DROP INDEX "PullRequest_projectId_prNumber_idx";

-- AlterTable
ALTER TABLE "PullRequest" DROP COLUMN "prNumber",
ADD COLUMN     "prId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "PullRequest_projectId_prId_idx" ON "PullRequest"("projectId", "prId");

-- CreateIndex
CREATE UNIQUE INDEX "PullRequest_prId_projectId_key" ON "PullRequest"("prId", "projectId");
