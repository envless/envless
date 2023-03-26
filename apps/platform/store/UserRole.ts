import { UserRole } from "@prisma/client";
import { create } from "zustand";

interface UserAccessStore {
  userRoleInProject: UserRole;

  setCurrentRole: (role: UserRole) => void;
}

export const useUserAccessStore = create<UserAccessStore>((set) => ({
  userRoleInProject: UserRole.guest, // safe default
  setCurrentRole: (role: UserRole) => {
    set({
      userRoleInProject: role,
    });
  },
}));
