/*
  Warnings:

  - The values [editor,viewer] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('maintainer', 'owner', 'developer', 'guest');
ALTER TABLE "ProjectInvite" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "ProjectInvite" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TABLE "Access" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "ProjectInvite" ALTER COLUMN "role" SET DEFAULT 'developer';
COMMIT;
