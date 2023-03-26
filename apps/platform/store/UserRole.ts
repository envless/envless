import { UserRole } from "@prisma/client";
import { create } from "zustand";

interface UserAccessStore {
  userRoleInProject: UserRole;

  setAccessData: (role: UserRole) => void;
}

export const useUserAccessStore = create<UserAccessStore>((set) => ({
  userRoleInProject: UserRole.guest, // safe default
  setAccessData: (role: UserRole) => {
    set({
      userRoleInProject: role,
    });
  },
}));
