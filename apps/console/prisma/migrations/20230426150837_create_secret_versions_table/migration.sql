/*
  Warnings:

  - You are about to drop the column `parentId` on the `Secret` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `Secret` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Secret" DROP COLUMN "parentId",
DROP COLUMN "version";

-- CreateTable
CREATE TABLE "SecretVersion" (
    "id" TEXT NOT NULL,
    "encryptedKey" TEXT NOT NULL,
    "encryptedValue" TEXT NOT NULL,
    "secretId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SecretVersion_pkey" PRIMARY KEY ("id")
);
