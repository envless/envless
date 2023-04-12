import { Branch } from "@prisma/client";
import { create } from "zustand";

interface BranchesStore {
  branches: Branch[];
  setBranches: (branches: Branch[]) => void;
  currentBranch: Branch;
  setCurrentBranch: (branch: Branch) => void;
}

export const useBranchesStore = create<BranchesStore>((set) => ({
  branches: [] as Branch[],
  setBranches: (branches: Branch[]) => {
    set({
      branches: branches,
      currentBranch: branches[0],
    });
  },
  currentBranch: {} as Branch,
  setCurrentBranch: (branch: Branch) => {
    set({
      currentBranch: branch,
    });
  },
}));
