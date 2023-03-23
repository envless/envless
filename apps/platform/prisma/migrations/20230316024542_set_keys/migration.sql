/*
  Warnings:

  - A unique constraint covering the columns `[projectId]` on the table `PublicKey` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `projectId` to the `PublicKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PublicKey" ADD COLUMN     "projectId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ProjectKey" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "encryptedPrivateKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectKey_projectId_key" ON "ProjectKey"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "PublicKey_projectId_key" ON "PublicKey"("projectId");
