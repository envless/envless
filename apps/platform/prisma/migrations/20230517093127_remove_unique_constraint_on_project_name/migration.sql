/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Project_name_slug_key";

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
