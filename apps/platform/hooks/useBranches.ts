import { useBranchesStore } from "@/store/Branches";
import { trpc } from "@/utils/trpc";
import { Project } from "@prisma/client";

interface Props {
  currentProject: Project;
}

export const useBranches = ({ currentProject }: Props) => {
  const { branches, setBranches } = useBranchesStore();
  const branchQuery = trpc.branches.getAll.useQuery(
    {
      projectId: currentProject.id,
    },
    {
      enabled: !!currentProject.id && branches.length !== 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setBranches(data);
      },
    },
  );

  return {
    branches: branchQuery.data ?? [],
  };
};
