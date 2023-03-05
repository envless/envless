Today's Roadmap

[] Project Overview
[] Prisma
[] Seeder
[] TRPC
[] Slight Frontend

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
-   createdAt DateTime? @default(now())
-   mergedAt DateTime?
-   closedAt DateTime?

- @@unique([prNumber, projectId])
- @@index([projectId, status])
- @@index([projectId, prNumber])

feat:  added hover call for pull request title
dahal merged 2 commits into main from feat/hover-card-for-pull-reques-title 17 hours ago
(commits, Files changed, Reviewers, Labels, Assignees)

Commits
Diff (base branch and current branch)

ENV blob

model User {
  pullRequestsCreatedBy PullRequest[] @relation(name: "createdBy")
  pullRequestsMergedBy PullRequest[] @relation(name: "mergedBy")
  pullRequestsClosedBy PullRequest[] @relation(name: "closedBy")
  }

  enum PrStatus {
  open
  closed
  merged
}

model Project {
    pullRequests PullRequest[]
}


model PullRequest {
  id String @id @default(cuid())
  title String
  prNumber String
  status PrStatus
  projectId String
  createdById String
  mergedById  String?
  closedById String?
  baseBranchId  String?
  currentBranchId String?
  createdAt   DateTime @default(now())
  mergedAt   DateTime?
  closedAt   DateTime?

  project    Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
    
  createdBy  User  @relation(name: "createdBy", fields: [createdById], references: [id], onDelete: Cascade)
  mergedBy  User?  @relation(name: "mergedBy", fields: [mergedById], references: [id], onDelete: Cascade)
  closedBy  User?  @relation(name: "closedBy", fields: [closedById], references: [id], onDelete: Cascade)

  @@unique([prNumber, projectId])
  @@index([projectId, status])
  @@index([projectId, prNumber])
}