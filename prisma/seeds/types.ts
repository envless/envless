export type UserType = {
  id?: string;
  name: string;
  email: string;
};

export type ProjectType = {
  id?: string;
  name: string;
};

export type AccessType = {
  userId: string;
  projectId: string;
  role: "owner" | "maintainer" | "developer" | "guest";
};

export type AuditType = {
  action: string;
  data?: any;
  createdById: string;
  createdForId?: string;
  projectId?: string;
  role: "owner" | "mantainer" | "developer" | "guest";
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
