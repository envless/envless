/*
  Warnings:

  - You are about to drop the column `identifier` on the `VerificationToken` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "VerificationToken_identifier_token_key";

-- AlterTable
ALTER TABLE "VerificationToken" DROP COLUMN "identifier",
ADD COLUMN  "encryptedOtp" TEXT,
ADD COLUMN  "projectId" TEXT,
ADD COLUMN  "type" TEXT,
ADD COLUMN  "userId" TEXT;
