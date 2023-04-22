import { createContext } from "react";
import { Branch } from "@prisma/client";
import { createStore } from "zustand";

export interface BranchProps {
  branches: Branch[];
  currentBranch: Branch;
  baseBranch: Branch;
}

export interface BranchState extends BranchProps {
  setBranches: (branches: Branch[]) => void;
  setCurrentBranch: (branch: Branch) => void;
  setBaseBranch: (branch: Branch) => void;
  addBranch: (branch: Branch) => void;
  removeBranch: (branchId: string) => void;
}

export type BranchStore = ReturnType<typeof createBranchStore>;
export type BranchProviderProps = React.PropsWithChildren<BranchProps>;

export const createBranchStore = (initProps?: Partial<BranchProps>) => {
  const DEFAULT_PROPS: BranchProps = {
    branches: [],
    currentBranch: {} as Branch,
    baseBranch: {} as Branch,
  };

  console.log("----initProps in our zustand----", initProps);

  return createStore<BranchState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    setBranches: (branches: Branch[]) => {
      set({
        branches: branches,
        currentBranch: branches[0],
        baseBranch: branches[0],
      });
    },
    setCurrentBranch: (branch: Branch) => {
      set({
        currentBranch: branch,
      });
    },
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
    removeBranch: (branchId: string) => {
      set((state) => ({
        branches: state.branches.filter((branch) => branch.id !== branchId),
      }));
    },
  }));
};

export const BranchesContext = createContext<BranchStore | null>(null);
