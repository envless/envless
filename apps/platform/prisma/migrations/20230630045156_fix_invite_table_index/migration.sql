/*
  Warnings:

  - A unique constraint covering the columns `[inviteeId,projectId]` on the table `Invite` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Invite_inviteeId_idx";

-- DropIndex
DROP INDEX "Invite_userId_projectId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Invite_inviteeId_projectId_key" ON "Invite"("inviteeId", "projectId");
