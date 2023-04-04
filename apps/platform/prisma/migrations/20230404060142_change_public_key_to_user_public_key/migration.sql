/*
  Warnings:

  - You are about to drop the `PublicKey` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "PublicKey";

-- CreateTable
CREATE TABLE "UserPublicKey" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "key" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "UserPublicKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPublicKey_userId_key" ON "UserPublicKey"("userId");

-- CreateIndex
CREATE INDEX "UserPublicKey_userId_idx" ON "UserPublicKey"("userId");
