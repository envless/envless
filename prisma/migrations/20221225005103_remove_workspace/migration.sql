/*
  Warnings:

  - You are about to drop the column `workspaceId` on the `Access` table. All the data in the column will be lost.
  - You are about to drop the column `workspaceId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `Workspace` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,projectId]` on the table `Access` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `projectId` to the `Access` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Access_userId_workspaceId_key` ON `Access`;

-- DropIndex
DROP INDEX `Access_workspaceId_idx` ON `Access`;

-- DropIndex
DROP INDEX `Project_name_workspaceId_key` ON `Project`;

-- DropIndex
DROP INDEX `Project_workspaceId_idx` ON `Project`;

-- AlterTable
ALTER TABLE `Access` DROP COLUMN `workspaceId`,
    ADD COLUMN `projectId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Project` DROP COLUMN `workspaceId`;

-- DropTable
DROP TABLE `Workspace`;

-- CreateIndex
CREATE INDEX `Access_projectId_idx` ON `Access`(`projectId`);

-- CreateIndex
CREATE UNIQUE INDEX `Access_userId_projectId_key` ON `Access`(`userId`, `projectId`);

-- CreateIndex
CREATE UNIQUE INDEX `Project_name_key` ON `Project`(`name`);
