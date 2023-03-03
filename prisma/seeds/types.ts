export type UserType = {
  id?: string;
  name: string;
  email: string;
}

export type ProjectType = {
  id?: string;
  name: string;
}

export type AccessType = {
  userId: string;
  projectId: string;
  role: 'owner' | 'mentainer' | 'developer' | 'guest';
}
