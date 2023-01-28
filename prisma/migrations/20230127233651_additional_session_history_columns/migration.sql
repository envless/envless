-- AlterTable
ALTER TABLE `SessionHistory` ADD COLUMN `cpu` JSON NULL,
    ADD COLUMN `engine` JSON NULL,
    ADD COLUMN `mfa` BOOLEAN NULL DEFAULT false;

-- CreateIndex
CREATE INDEX `SessionHistory_userId_idx` ON `SessionHistory`(`userId`);
