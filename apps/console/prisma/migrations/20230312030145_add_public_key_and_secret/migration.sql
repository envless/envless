/*
  Warnings:

  - You are about to drop the column `projectId` on the `PublicKey` table. All the data in the column will be lost.
  - You are about to drop the `Env` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `PublicKey` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "PublicKey_projectId_idx";

-- AlterTable
ALTER TABLE "PublicKey" DROP COLUMN "projectId";

-- DropTable
DROP TABLE "Env";

-- CreateTable
CREATE TABLE "Secret" (
    "id" TEXT NOT NULL,
    "cipher" TEXT NOT NULL DEFAULT 'aes-256-gcm',
    "iv" TEXT NOT NULL DEFAULT '',
    "tag" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,

    CONSTRAINT "Secret_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Secret_userId_idx" ON "Secret"("userId");

-- CreateIndex
CREATE INDEX "Secret_branchId_idx" ON "Secret"("branchId");

-- CreateIndex
CREATE UNIQUE INDEX "PublicKey_userId_key" ON "PublicKey"("userId");
