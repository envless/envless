/*
  Warnings:

  - A unique constraint covering the columns `[accessId]` on the table `Invite` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Invite" ADD COLUMN     "accessId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Invite_accessId_key" ON "Invite"("accessId");

-- CreateIndex
CREATE INDEX "Invite_accessId_idx" ON "Invite"("accessId");
