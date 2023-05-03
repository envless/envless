/*
  Warnings:

  - You are about to drop the column `expires` on the `ProjectInvite` table. All the data in the column will be lost.
  - You are about to drop the column `twoFactor` on the `User` table. All the data in the column will be lost.
  - Added the required column `hashedPassword` to the `ProjectInvite` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `ProjectInvite` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "ProjectInvite" DROP COLUMN "expires",
ADD COLUMN     "accepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hashedPassword" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "invitedById" TEXT,
ADD COLUMN     "retryCount" INTEGER NOT NULL DEFAULT 0,
ADD CONSTRAINT "ProjectInvite_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "twoFactor",
ADD COLUMN     "encryptedTwoFactorSecret" JSONB;

-- CreateIndex
CREATE INDEX "ProjectInvite_email_invitationToken_idx" ON "ProjectInvite"("email", "invitationToken");
