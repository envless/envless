-- CreateIndex
CREATE INDEX "PullRequest_baseBranchId_idx" ON "PullRequest"("baseBranchId");

-- CreateIndex
CREATE INDEX "PullRequest_currentBranchId_idx" ON "PullRequest"("currentBranchId");
