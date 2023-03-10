-- AlterTable
ALTER TABLE "User" ADD COLUMN     "salt" TEXT,
ADD COLUMN     "verifier" TEXT;
