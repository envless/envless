import { LockedUser, UserRole } from "@prisma/client";

export interface UserType {
  id: string;
  name?: string;
  email: string;
  image?: string;
  role?: UserRole;
  twoFactorEnabled: boolean;
  clientSideTwoFactorVerified: boolean;
  locked: LockedUser | null;
}
