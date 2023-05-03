/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Secret` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uuid` to the `Secret` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Secret" ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Secret_uuid_key" ON "Secret"("uuid");

-- CreateIndex
CREATE INDEX "Secret_uuid_idx" ON "Secret"("uuid");
