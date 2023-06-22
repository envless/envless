/*
  Warnings:

  - You are about to drop the column `encryptedPrivateKey` on the `Keychain` table. All the data in the column will be lost.
  - Added the required column `verificationString` to the `Keychain` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Keychain" DROP COLUMN "encryptedPrivateKey",
ADD COLUMN     "verificationString" TEXT NOT NULL;
