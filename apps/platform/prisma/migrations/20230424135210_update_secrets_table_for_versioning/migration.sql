/*
  Warnings:

  - You are about to drop the column `parentId` on the `Secret` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[originalId]` on the table `Secret` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Secret" DROP COLUMN "parentId",
ADD COLUMN     "originalId" TEXT,
ALTER COLUMN "version" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Secret_originalId_key" ON "Secret"("originalId");
