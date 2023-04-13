-- AlterTable
ALTER TABLE "Secret" ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;
