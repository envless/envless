/*
  Warnings:

  - Made the column `userId` on table `UserPublicKey` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "UserPublicKey_userId_idx";

-- AlterTable
ALTER TABLE "UserPublicKey" ALTER COLUMN "userId" SET NOT NULL;
