/*
  Warnings:

  - You are about to drop the `ProjectSetting` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "settings" JSONB NOT NULL DEFAULT '{}';

-- DropTable
DROP TABLE "ProjectSetting";
