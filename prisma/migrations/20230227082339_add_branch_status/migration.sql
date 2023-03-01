-- AlterTable
ALTER TABLE `Branch` ADD COLUMN `status` ENUM('open', 'closed', 'merged') NULL;
