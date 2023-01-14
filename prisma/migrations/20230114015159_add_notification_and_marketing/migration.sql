-- AlterTable
ALTER TABLE `User` ADD COLUMN `marketing` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `notification` BOOLEAN NOT NULL DEFAULT true;
