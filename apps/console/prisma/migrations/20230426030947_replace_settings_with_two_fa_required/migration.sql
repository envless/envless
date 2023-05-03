/*
  Warnings:

  - You are about to drop the column `settings` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "settings",
ADD COLUMN     "twoFactorRequired" BOOLEAN NOT NULL DEFAULT false;
