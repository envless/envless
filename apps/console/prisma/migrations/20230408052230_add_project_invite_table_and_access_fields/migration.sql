/*
  Warnings:

  - You are about to drop the column `active` on the `Access` table. All the data in the column will be lost.
  - You are about to drop the column `accepted` on the `ProjectInvite` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `ProjectInvite` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `ProjectInvite` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projectInviteId]` on the table `Access` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('active', 'pending', 'inactive');

-- DropIndex
DROP INDEX "ProjectInvite_email_invitationToken_idx";

-- DropIndex
DROP INDEX "ProjectInvite_email_projectId_key";

-- AlterTable
ALTER TABLE "Access" DROP COLUMN "active",
ADD COLUMN     "projectInviteId" TEXT,
ADD COLUMN     "status" "MembershipStatus" NOT NULL DEFAULT 'pending',
ALTER COLUMN "role" SET DEFAULT 'guest';

-- AlterTable
ALTER TABLE "ProjectInvite" DROP COLUMN "accepted",
DROP COLUMN "email",
DROP COLUMN "role";

-- CreateIndex
CREATE UNIQUE INDEX "Access_projectInviteId_key" ON "Access"("projectInviteId");

-- CreateIndex
CREATE INDEX "Access_projectInviteId_idx" ON "Access"("projectInviteId");
