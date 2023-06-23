-- AlterTable
ALTER TABLE "Keychain" ADD COLUMN     "downloaded" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "SecretVersion_pullRequestId_idx" ON "SecretVersion"("pullRequestId");
