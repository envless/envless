import { useBranchesStore } from "@/store/Branches";
import { trpc } from "@/utils/trpc";
import { Project } from "@prisma/client";

interface Props {
  currentProject: Project;
}

export const useBranches = ({ currentProject }: Props) => {
  const { setBranches } = useBranchesStore();
  const { data, refetch } = trpc.branches.getAll.useQuery(
    {
      projectId: currentProject.id,
    },
    {
      enabled: !!currentProject.id,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setBranches(data);
      },
    },
  );

  return {
    allBranches: data ?? [],
    refetchBranches: refetch,
  };
};
