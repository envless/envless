-- AlterTable
ALTER TABLE "User" ADD COLUMN     "failedAuthAttempts" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "LockedUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reason" TEXT,
    "lockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LockedUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LockedUser_userId_key" ON "LockedUser"("userId");

-- CreateIndex
CREATE INDEX "LockedUser_userId_idx" ON "LockedUser"("userId");
