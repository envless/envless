import type {
  LockedUser,
  MembershipStatus,
  ProjectInvite,
  UserRole,
} from "@prisma/client";

export interface UserType {
  id: string;
  name?: string;
  email: string;
  image?: string;
  role: UserRole;
  twoFactorEnabled: boolean;
  clientSideTwoFactorVerified: boolean;
  locked: LockedUser | null;
}
export interface MemberType {
  id: string;
  projectInviteId: string | null;
  projectInvite: ProjectInvite | null;
  name: string | null;
  email: string;
  image: string | null;
  twoFactorEnabled: boolean;
  role: UserRole;
  status: MembershipStatus;
}
