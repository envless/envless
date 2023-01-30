/*
  Warnings:

  - You are about to drop the column `bot` on the `SessionHistory` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `SessionHistory` table. All the data in the column will be lost.
  - You are about to drop the column `client` on the `SessionHistory` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `SessionHistory` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `SessionHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `SessionHistory` DROP COLUMN `bot`,
    DROP COLUMN `city`,
    DROP COLUMN `client`,
    DROP COLUMN `country`,
    DROP COLUMN `region`,
    ADD COLUMN `browser` JSON NULL,
    ADD COLUMN `geo` JSON NULL,
    ADD COLUMN `isBot` BOOLEAN NULL DEFAULT false;
