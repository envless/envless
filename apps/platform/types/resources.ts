import { Key } from "react";
import type {
  LockedUser,
  MembershipStatus,
  ProjectInvite,
  UserRole,
} from "@prisma/client";

export interface KeychainType {
  temp: boolean;
  privateKey: string;
  encryptedPrivateKey: {
    iv: string;
    tag: string;
    ciphertext: string;
  };
}

export interface UserType {
  id: string;
  name?: string;
  email: string;
  image?: string;
  role?: UserRole;
  twoFactorEnabled: boolean;
  twoFactorVerified: boolean;
  locked: LockedUser | null;
  keychain: KeychainType;
  hasMasterPassword: boolean;
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
