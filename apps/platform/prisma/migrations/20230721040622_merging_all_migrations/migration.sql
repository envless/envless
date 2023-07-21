-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('maintainer', 'owner', 'developer', 'guest');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('active', 'pending', 'inactive');

-- CreateEnum
CREATE TYPE "BranchStatus" AS ENUM ('open', 'closed', 'merged');

-- CreateEnum
CREATE TYPE "PullRequestStatus" AS ENUM ('open', 'merged', 'closed', 'reOpened');

-- CreateTable
CREATE TABLE "Audit" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" TEXT NOT NULL,
    "data" JSONB,
    "createdById" TEXT NOT NULL,
    "createdForId" TEXT,
    "projectId" TEXT,

    CONSTRAINT "Audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "twoFactorRequired" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Keychain" (
    "id" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "revocationCertificate" TEXT NOT NULL,
    "verificationString" TEXT NOT NULL,
    "userId" TEXT,
    "downloaded" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "Keychain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EncryptedProjectKey" (
    "id" TEXT NOT NULL,
    "encryptedKey" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EncryptedProjectKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invite" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "invitorId" TEXT NOT NULL,
    "inviteeId" TEXT NOT NULL,
    "accessId" TEXT,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Access" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'guest',
    "status" "MembershipStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "Access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdById" TEXT NOT NULL,
    "protected" BOOLEAN NOT NULL DEFAULT false,
    "protectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PullRequest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "prId" INTEGER NOT NULL,
    "status" "PullRequestStatus" NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "mergedById" TEXT,
    "closedById" TEXT,
    "reOpenedById" TEXT,
    "baseBranchId" TEXT NOT NULL,
    "currentBranchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mergedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "reOpenedAt" TIMESTAMP(3),

    CONSTRAINT "PullRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Secret" (
    "id" TEXT NOT NULL,
    "encryptedKey" TEXT NOT NULL,
    "encryptedValue" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,

    CONSTRAINT "Secret_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecretVersion" (
    "id" TEXT NOT NULL,
    "encryptedKey" TEXT NOT NULL,
    "encryptedValue" TEXT NOT NULL,
    "secretId" TEXT,
    "baseBranchId" TEXT,
    "currentBranchId" TEXT,
    "pullRequestId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SecretVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" INTEGER,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ip" TEXT,
    "os" JSONB DEFAULT '{}',
    "geo" JSONB,
    "device" JSONB DEFAULT '{}',
    "browser" JSONB DEFAULT '{}',
    "engine" JSONB DEFAULT '{}',
    "cpu" JSONB DEFAULT '{}',
    "isBot" BOOLEAN DEFAULT false,
    "mfa" BOOLEAN DEFAULT false,
    "fingerprint" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SessionHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "cliId" TEXT,
    "encryptedTwoFactorSecret" JSONB,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "failedAuthAttempts" INTEGER NOT NULL DEFAULT 0,
    "marketing" BOOLEAN NOT NULL DEFAULT true,
    "notification" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cli" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hashedToken" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cli_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LockedUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reason" TEXT,
    "lockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LockedUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Redirect" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Redirect_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Audit_createdById_idx" ON "Audit"("createdById");

-- CreateIndex
CREATE INDEX "Audit_createdForId_idx" ON "Audit"("createdForId");

-- CreateIndex
CREATE INDEX "Audit_projectId_idx" ON "Audit"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Keychain_userId_key" ON "Keychain"("userId");

-- CreateIndex
CREATE INDEX "Keychain_userId_idx" ON "Keychain"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "EncryptedProjectKey_projectId_key" ON "EncryptedProjectKey"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Invite_accessId_key" ON "Invite"("accessId");

-- CreateIndex
CREATE INDEX "Invite_invitorId_idx" ON "Invite"("invitorId");

-- CreateIndex
CREATE INDEX "Invite_projectId_idx" ON "Invite"("projectId");

-- CreateIndex
CREATE INDEX "Invite_accessId_idx" ON "Invite"("accessId");

-- CreateIndex
CREATE UNIQUE INDEX "Invite_inviteeId_projectId_key" ON "Invite"("inviteeId", "projectId");

-- CreateIndex
CREATE INDEX "Access_userId_idx" ON "Access"("userId");

-- CreateIndex
CREATE INDEX "Access_projectId_idx" ON "Access"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Access_userId_projectId_key" ON "Access"("userId", "projectId");

-- CreateIndex
CREATE INDEX "Branch_createdById_idx" ON "Branch"("createdById");

-- CreateIndex
CREATE INDEX "Branch_projectId_idx" ON "Branch"("projectId");

-- CreateIndex
CREATE INDEX "Branch_protected_idx" ON "Branch"("protected");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_name_projectId_key" ON "Branch"("name", "projectId");

-- CreateIndex
CREATE INDEX "PullRequest_createdById_idx" ON "PullRequest"("createdById");

-- CreateIndex
CREATE INDEX "PullRequest_mergedById_idx" ON "PullRequest"("mergedById");

-- CreateIndex
CREATE INDEX "PullRequest_closedById_idx" ON "PullRequest"("closedById");

-- CreateIndex
CREATE INDEX "PullRequest_reOpenedById_idx" ON "PullRequest"("reOpenedById");

-- CreateIndex
CREATE INDEX "PullRequest_baseBranchId_idx" ON "PullRequest"("baseBranchId");

-- CreateIndex
CREATE INDEX "PullRequest_currentBranchId_idx" ON "PullRequest"("currentBranchId");

-- CreateIndex
CREATE INDEX "PullRequest_createdAt_idx" ON "PullRequest"("createdAt");

-- CreateIndex
CREATE INDEX "PullRequest_projectId_status_idx" ON "PullRequest"("projectId", "status");

-- CreateIndex
CREATE INDEX "PullRequest_projectId_prId_idx" ON "PullRequest"("projectId", "prId");

-- CreateIndex
CREATE UNIQUE INDEX "PullRequest_prId_projectId_key" ON "PullRequest"("prId", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Secret_uuid_key" ON "Secret"("uuid");

-- CreateIndex
CREATE INDEX "Secret_userId_idx" ON "Secret"("userId");

-- CreateIndex
CREATE INDEX "Secret_branchId_idx" ON "Secret"("branchId");

-- CreateIndex
CREATE INDEX "Secret_uuid_idx" ON "Secret"("uuid");

-- CreateIndex
CREATE INDEX "SecretVersion_secretId_idx" ON "SecretVersion"("secretId");

-- CreateIndex
CREATE INDEX "SecretVersion_pullRequestId_idx" ON "SecretVersion"("pullRequestId");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE INDEX "SessionHistory_userId_idx" ON "SessionHistory"("userId");

-- CreateIndex
CREATE INDEX "SessionHistory_id_userId_fingerprint_idx" ON "SessionHistory"("id", "userId", "fingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_cliId_key" ON "User"("cliId");

-- CreateIndex
CREATE UNIQUE INDEX "Cli_userId_key" ON "Cli"("userId");

-- CreateIndex
CREATE INDEX "Cli_userId_idx" ON "Cli"("userId");

-- CreateIndex
CREATE INDEX "Cli_userId_active_idx" ON "Cli"("userId", "active");

-- CreateIndex
CREATE UNIQUE INDEX "LockedUser_userId_key" ON "LockedUser"("userId");

-- CreateIndex
CREATE INDEX "LockedUser_userId_idx" ON "LockedUser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
