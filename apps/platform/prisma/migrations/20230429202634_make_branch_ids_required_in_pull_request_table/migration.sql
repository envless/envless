/*
  Warnings:

  - Made the column `baseBranchId` on table `PullRequest` required. This step will fail if there are existing NULL values in that column.
  - Made the column `currentBranchId` on table `PullRequest` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PullRequest" ALTER COLUMN "baseBranchId" SET NOT NULL,
ALTER COLUMN "currentBranchId" SET NOT NULL;
