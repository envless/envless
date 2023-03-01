-- AlterTable
ALTER TABLE `Branch` ADD COLUMN `protected` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX `Branch_protected_idx` ON `Branch`(`protected`);
