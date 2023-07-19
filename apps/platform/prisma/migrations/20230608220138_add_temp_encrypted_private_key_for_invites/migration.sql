/*
  Warnings:

  - You are about to drop the column `encryptedPrivateKey` on the `Invite` table. All the data in the column will be lost.
  - You are about to drop the column `temporary` on the `Keychain` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Invite" DROP COLUMN "encryptedPrivateKey";

-- AlterTable
ALTER TABLE "Keychain" DROP COLUMN "temporary",
ADD COLUMN     "tempEncryptedPrivateKey" TEXT;
