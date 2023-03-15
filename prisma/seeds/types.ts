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
  email: string;
  projectId: string;
  invitationToken: string;
  hashedPassword: string;
  createdAt?: Date;
};

export type AccessType = {
  userId: string;
  projectId: string;
  role: "owner" | "maintainer" | "developer" | "guest";
  active?: boolean;
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
