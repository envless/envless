/*
  Warnings:

  - Added the required column `createdById` to the `Branch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Branch` ADD COLUMN `createdById` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `Branch_createdById_idx` ON `Branch`(`createdById`);
