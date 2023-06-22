-- AlterTable
ALTER TABLE "SecretVersion" ADD COLUMN     "baseBranchId" TEXT,
ADD COLUMN     "currentBranchId" TEXT,
ADD COLUMN     "pullRequestId" TEXT,
ALTER COLUMN "secretId" DROP NOT NULL;
