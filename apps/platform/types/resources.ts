import { Key } from "react";
import type {
  Invite,
  LockedUser,
  MembershipStatus,
  UserRole,
} from "@prisma/client";

export interface SessionUserType {
  id: string;
  name?: string;
  email: string;
  image?: string;
  role?: UserRole;
  locked: LockedUser | null;

  twoFactor: {
    enabled: boolean;
    verified: boolean;
  };

  keychain: {
    valid: boolean;
    present: boolean;
    downloaded: boolean;
    privateKey: string | null;
  };
}

export interface MemberType {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  twoFactorEnabled: boolean;
  role: UserRole;
  status: MembershipStatus;
  inviteId: string | null;
  invite: Invite | null;
}
