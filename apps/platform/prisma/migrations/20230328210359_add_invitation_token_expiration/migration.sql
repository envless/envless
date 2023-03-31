-- AlterTable
ALTER TABLE "ProjectInvite" ADD COLUMN     "invitationTokenExpiresAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
