export type UserType = {
  id?: string;
  name: string;
  email: string;
  image?: string;
};

export type ProjectType = {
  id?: string;
  name: string;
  slug: string;
};

export type ProjectInviteType = {
  id?: string;
  projectId: string;
  invitationToken: string;
  invitationTokenExpiresAt: Date;
  hashedPassword: string;
  createdAt?: Date;
};

export type AccessType = {
  userId: string;
  projectId: string;
  role: "owner" | "maintainer" | "developer" | "guest";
  status: "active" | "inactive" | "pending";
  projectInviteId?: string;
};

export type AuditType = {
  action: string;
  data?: any;
  createdById: string;
  createdForId?: string;
  projectId?: string;
};

export type BranchType = {
  id?: string;
  name: string;
  description?: string;
  protected: boolean;
  protectedAt?: Date | null;
  status?: string;
  createdById: string;
  projectId: string;
};

export type PullRequestType = {
  id?: string;
  prId: number;
  title: string;
  status: PullRequestStatusType;
  createdById: string;
  projectId: string;
};

export type PullRequestStatusType = {
  status: "open" | "closed" | "merged";
};

export type SecretType = {
  id?: string;
  encryptedKey: string;
  encryptedValue: string;
  projectId: string;
  userId: string;
  branchId: string;
  uuid: string;
};
