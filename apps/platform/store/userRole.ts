import { Access, UserRole } from "@prisma/client";
import { create } from "zustand";

interface UserAccessStore {
  accessData?: Access;
  isAdmin: boolean;
  isDeveloper: boolean;
  isGuest: boolean;
  isMaintainer: boolean;
  isOwner: boolean;
  setAccessData: (data?: Access) => void;
}

export const useUserAccessStore = create<UserAccessStore>((set) => ({
  accessData: undefined,
  isAdmin: false,
  isDeveloper: false,
  isGuest: false,
  isMaintainer: false,
  isOwner: false,
  setAccessData: (data?: Access) => {
    set({
      accessData: data,
      isAdmin:
        data?.role === UserRole.owner || data?.role === UserRole.maintainer,
      isDeveloper: data?.role === UserRole.developer,
      isGuest: data?.role === UserRole.guest,
      isMaintainer: data?.role === UserRole.maintainer,
      isOwner: data?.role === UserRole.owner,
    });
  },
}));
