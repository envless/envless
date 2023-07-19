/*
  Warnings:

  - You are about to drop the column `hashedPassword` on the `Invite` table. All the data in the column will be lost.
  - You are about to drop the column `tempEncryptedPrivateKey` on the `Keychain` table. All the data in the column will be lost.
  - You are about to drop the column `hashedPassword` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Invite" DROP COLUMN "hashedPassword";

-- AlterTable
ALTER TABLE "Keychain" DROP COLUMN "tempEncryptedPrivateKey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "hashedPassword";
