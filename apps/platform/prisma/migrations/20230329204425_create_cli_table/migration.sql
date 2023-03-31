/*
  Warnings:

  - A unique constraint covering the columns `[cliId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PublicKey" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cliConfigured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "cliId" TEXT;

-- CreateTable
CREATE TABLE "Cli" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hashedToken" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cli_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cli_userId_key" ON "Cli"("userId");

-- CreateIndex
CREATE INDEX "Cli_userId_idx" ON "Cli"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_cliId_key" ON "User"("cliId");
