/*
  Warnings:

  - You are about to drop the column `teamId` on the `Access` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `projectId` to the `Access` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Access` DROP COLUMN `teamId`,
    ADD COLUMN `projectId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Project` DROP COLUMN `teamId`,
    DROP COLUMN `userId`;

-- DropTable
DROP TABLE `Team`;
