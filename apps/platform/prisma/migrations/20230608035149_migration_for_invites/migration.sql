/*
  Warnings:

  - You are about to drop the column `projectInviteId` on the `Access` table. All the data in the column will be lost.
  - You are about to drop the `ProjectInvite` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Access_projectInviteId_idx";

-- DropIndex
DROP INDEX "Access_projectInviteId_key";

-- AlterTable
ALTER TABLE "Access" DROP COLUMN "projectInviteId";

-- AlterTable
ALTER TABLE "Keychain" ADD COLUMN     "temporary" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "ProjectInvite";

-- CreateTable
CREATE TABLE "Invite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "encryptedPrivateKey" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "invitorId" TEXT NOT NULL,
    "inviteeId" TEXT NOT NULL,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Invite_invitorId_idx" ON "Invite"("invitorId");

-- CreateIndex
CREATE INDEX "Invite_inviteeId_idx" ON "Invite"("inviteeId");

-- CreateIndex
CREATE INDEX "Invite_projectId_idx" ON "Invite"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Invite_userId_projectId_key" ON "Invite"("userId", "projectId");
