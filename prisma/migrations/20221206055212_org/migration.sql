/*
  Warnings:

  - You are about to drop the column `projectId` on the `Access` table. All the data in the column will be lost.
  - Added the required column `orgId` to the `Access` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Access` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `orgId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Access` DROP COLUMN `projectId`,
    ADD COLUMN `orgId` VARCHAR(191) NOT NULL,
    MODIFY `userId` VARCHAR(191) NOT NULL,
    MODIFY `role` VARCHAR(191) NULL DEFAULT 'admin';

-- AlterTable
ALTER TABLE `Project` ADD COLUMN `orgId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Org` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
