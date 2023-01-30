/*
  Warnings:

  - You are about to drop the column `active` on the `SessionHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `SessionHistory` DROP COLUMN `active`,
    ADD COLUMN `fingerprint` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `SessionHistory_fingerprint_idx` ON `SessionHistory`(`fingerprint`);
