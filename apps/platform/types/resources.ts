import { Key } from "react";
import type {
  Invite,
  LockedUser,
  MembershipStatus,
  UserRole,
} from "@prisma/client";

export interface UserType {
  id: string;
  name?: string;
  email: string;
  image?: string;
  role?: UserRole;
  privateKey: string;
  twoFactorEnabled: boolean;
  twoFactorVerified: boolean;
  locked: LockedUser | null;
  isPrivateKeyValid: boolean;
}

export interface MemberType {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  twoFactorEnabled: boolean;
  role: UserRole;
  status: MembershipStatus;
}
