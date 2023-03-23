-- CreateTable
CREATE TABLE "PublicKey" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "key" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "PublicKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PublicKey_userId_idx" ON "PublicKey"("userId");

-- CreateIndex
CREATE INDEX "PublicKey_projectId_idx" ON "PublicKey"("projectId");
