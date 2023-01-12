/*
  Warnings:

  - You are about to drop the column `event` on the `Audit` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Audit` table. All the data in the column will be lost.
  - Added the required column `action` to the `Audit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Audit` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Audit_userId_idx` ON `Audit`;

-- AlterTable
ALTER TABLE `Audit` DROP COLUMN `event`,
    DROP COLUMN `userId`,
    ADD COLUMN `action` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdById` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdForId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Audit_createdById_idx` ON `Audit`(`createdById`);

-- CreateIndex
CREATE INDEX `Audit_createdForId_idx` ON `Audit`(`createdForId`);
