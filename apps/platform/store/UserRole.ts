import { UserRole } from "@prisma/client";
import { create } from "zustand";

interface UserAccessStore {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
}

export const useUserAccessStore = create<UserAccessStore>((set) => ({
  currentRole: UserRole.guest, // safe default
  setCurrentRole: (role: UserRole) => {
    set({
      currentRole: role,
    });
  },
}));
