/*
  Warnings:

  - You are about to drop the column `cliId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Cli` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[serviceAccountId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_cliId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "cliId",
ADD COLUMN     "serviceAccountId" TEXT;

-- DropTable
DROP TABLE "Cli";

-- CreateTable
CREATE TABLE "ServiceAccount" (
    "id" TEXT NOT NULL,
    "integration" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "hashedToken" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ServiceAccount_projectId_idx" ON "ServiceAccount"("projectId");

-- CreateIndex
CREATE INDEX "ServiceAccount_createdById_idx" ON "ServiceAccount"("createdById");

-- CreateIndex
CREATE INDEX "ServiceAccount_integration_projectId_idx" ON "ServiceAccount"("integration", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "User_serviceAccountId_key" ON "User"("serviceAccountId");
