-- DropIndex
DROP INDEX "ServiceAccount_integration_projectId_idx";

-- CreateIndex
CREATE INDEX "ServiceAccount_projectId_integration_idx" ON "ServiceAccount"("projectId", "integration");

-- CreateIndex
CREATE INDEX "ServiceAccount_projectId_createdById_integration_idx" ON "ServiceAccount"("projectId", "createdById", "integration");
