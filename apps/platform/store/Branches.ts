import { Branch } from "@prisma/client";
import { create } from "zustand";

interface BranchesStore {
  branches: Branch[];
  setBranches: (branches: Branch[]) => void;
}

export const useBranchesStore = create<BranchesStore>((set) => ({
  branches: [] as Branch[],
  setBranches: (branches: Branch[]) => {
    set({
      branches: branches,
    });
  },
}));
