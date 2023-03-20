/*
  Warnings:

  - You are about to drop the column `projectId` on the `PublicKey` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "PublicKey_projectId_key";

-- AlterTable
ALTER TABLE "PublicKey" DROP COLUMN "projectId";
