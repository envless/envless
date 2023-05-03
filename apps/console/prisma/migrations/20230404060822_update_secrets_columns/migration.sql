/*
  Warnings:

  - You are about to drop the column `cipher` on the `Secret` table. All the data in the column will be lost.
  - You are about to drop the column `iv` on the `Secret` table. All the data in the column will be lost.
  - You are about to drop the column `tag` on the `Secret` table. All the data in the column will be lost.
  - Added the required column `encryptedKey` to the `Secret` table without a default value. This is not possible if the table is not empty.
  - Added the required column `encryptedValue` to the `Secret` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Secret" DROP COLUMN "cipher",
DROP COLUMN "iv",
DROP COLUMN "tag",
ADD COLUMN     "encryptedKey" TEXT NOT NULL,
ADD COLUMN     "encryptedValue" TEXT NOT NULL;
