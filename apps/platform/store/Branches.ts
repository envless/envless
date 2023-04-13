import { Branch } from "@prisma/client";
import { create } from "zustand";

interface BranchesStore {
  branches: Branch[];
  setBranches: (branches: Branch[]) => void;
  currentBranch: Branch;
  setCurrentBranch: (branch: Branch) => void;
  baseBranch: Branch;
  setBaseBranch: (branch: Branch) => void;
  addBranch: (branch: Branch) => void;
  removeBranch: (branch: Branch) => void;
}

export const useBranchesStore = create<BranchesStore>((set) => ({
  branches: [] as Branch[],
  setBranches: (branches: Branch[]) => {
    set({
      branches: branches,
      currentBranch: branches[0],
      baseBranch: branches[0],
    });
  },
  currentBranch: {} as Branch,
  setCurrentBranch: (branch: Branch) => {
    set({
      currentBranch: branch,
    });
  },
  baseBranch: {} as Branch,
  setBaseBranch: (branch: Branch) => {
    set({
      baseBranch: branch,
    });
  },
  addBranch: (branch: Branch) => {
    set((state) => ({
      branches: [...state.branches, branch],
    }));
  },
  removeBranch: (branchToBeRemoved: Branch) => {
    set((state) => ({
      branches: state.branches.filter(
        (branch) => branch.id !== branchToBeRemoved.id,
      ),
    }));
  },
}));
