`Pull Request`
-   id
-   title
-   prNumber
-   status (enum OPEN, MERGED, CLOSED)
-   projectId not null
-   createdById not null
-   closedById  nullable
-   mergedById  nullable
-   createdAt timestamp default(@now())
-   updatedAt timestamp default(@now())
- @unique([prNumber, projectId])
- @index([projectId, createdById])
- @index([title])
- @index([prNumber])

feat:  added hover call for pull request title
dahal merged 2 commits into main from feat/hover-card-for-pull-reques-title 17 hours ago
(commits, Files changed, Reviewers, Labels, Assignees)

Commits
Diff (base branch and current branch)