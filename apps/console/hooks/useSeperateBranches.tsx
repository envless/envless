import { useEffect, useState } from "react";
import { Branch } from "@prisma/client";

export const useSeperateBranches = (branches: Branch[]) => {
  const [seperateBranches, setSeperateBranches] = useState<ProjectBranches>({
    protected: [],
    unprotected: [],
  });

  useEffect(() => {
    const { protectedBranches, unprotectedBranches } = branches.reduce(
      (acc, branch) => {
        const { protectedBranches, unprotectedBranches } = acc;
        const protection = branch.protected;

        return {
          ...acc,
          ...{
            [protection ? "protectedBranches" : "unprotectedBranches"]: [
              ...(protection ? protectedBranches : unprotectedBranches),
              branch,
            ],
          },
        };
      },
      {
        protectedBranches: [],
        unprotectedBranches: [],
      },
    );

    setSeperateBranches({
      protected: protectedBranches,
      unprotected: unprotectedBranches,
    });
  }, [branches]);

  return seperateBranches;
};

type ProjectBranches = { protected: Branch[]; unprotected: Branch[] };
