/*
  Warnings:

  - A unique constraint covering the columns `[projectId,integration]` on the table `ServiceAccount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[projectId,createdById,integration]` on the table `ServiceAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ServiceAccount_projectId_integration_key" ON "ServiceAccount"("projectId", "integration");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceAccount_projectId_createdById_integration_key" ON "ServiceAccount"("projectId", "createdById", "integration");
