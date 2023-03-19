/*
  Warnings:

  - The `role` column on the `Access` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `ProjectInvite` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('maintainer', 'owner', 'editor', 'viewer', 'developer', 'guest');

-- AlterTable
ALTER TABLE "Access" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'owner';

-- AlterTable
ALTER TABLE "ProjectInvite" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'developer';
