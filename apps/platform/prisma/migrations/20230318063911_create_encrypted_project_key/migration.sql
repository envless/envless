/*
  Warnings:

  - You are about to drop the `ProjectKey` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ProjectKey";

-- CreateTable
CREATE TABLE "EncryptedProjectKey" (
    "id" TEXT NOT NULL,
    "encryptedKey" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EncryptedProjectKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EncryptedProjectKey_projectId_key" ON "EncryptedProjectKey"("projectId");
