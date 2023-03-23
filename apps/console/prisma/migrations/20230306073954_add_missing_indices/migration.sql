-- CreateIndex
CREATE INDEX "PullRequest_createdById_idx" ON "PullRequest"("createdById");

-- CreateIndex
CREATE INDEX "PullRequest_mergedById_idx" ON "PullRequest"("mergedById");

-- CreateIndex
CREATE INDEX "PullRequest_closedById_idx" ON "PullRequest"("closedById");
