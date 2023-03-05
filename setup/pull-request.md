`Pull Request`
-   id
-   title
-   prNumber
-   status (enum OPEN, MERGED, CLOSED)
-   projectId not null
-   createdById not null
-   closedById  nullable
-   mergedById  nullable
-   baseBranchId --> envs -> parse to JSON
-   currentBranchId --> envs --> parse to JSON
-   createdAt timestamp default(@now())
-   mergedAt timestamp default(null)
-   closedAt timestamp default(null)

- @unique([prNumber, projectId])
- @index([projectId, status])
- @index([projectId, prNumber])

feat:  added hover call for pull request title
dahal merged 2 commits into main from feat/hover-card-for-pull-reques-title 17 hours ago
(commits, Files changed, Reviewers, Labels, Assignees)

Commits
Diff (base branch and current branch)

ENV blob