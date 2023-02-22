/*
  Warnings:

  - You are about to drop the column `encryptedPassphrase` on the `ProjectInvite` table. All the data in the column will be lost.
  - You are about to drop the column `expires` on the `ProjectInvite` table. All the data in the column will be lost.
  - You are about to drop the column `twoFactor` on the `User` table. All the data in the column will be lost.
  - Added the required column `hashedPassword` to the `ProjectInvite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ProjectInvite` DROP COLUMN `encryptedPassphrase`,
    DROP COLUMN `expires`,
    ADD COLUMN `hashedPassword` VARCHAR(191) NOT NULL,
    ADD COLUMN `retryCount` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `twoFactor`,
    ADD COLUMN `encryptedTwoFactorSecret` JSON NULL;

-- CreateIndex
CREATE INDEX `ProjectInvite_email_invitationToken_idx` ON `ProjectInvite`(`email`, `invitationToken`);
