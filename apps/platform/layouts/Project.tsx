import { useContext, useRef } from "react";
import {
  BranchProps,
  BranchState,
  BranchStore,
  BranchesContext,
  createBranchStore,
} from "@/store/Branches";
import { trpc } from "@/utils/trpc";
import type { Project, UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { useStore } from "zustand";
import { Tabs } from "@/components/projects";
import { Container, Nav } from "@/components/theme";

interface Props {
  tab?: string;
  projects: Project[];
  currentProject: Project;
  currentRole: UserRole | string;
  children: React.ReactNode;
}

const ProjectLayout = ({
  tab,
  projects,
  children,
  currentProject,
  currentRole,
}: Props) => {
  const { data: session, status } = useSession();
  const user = session?.user;

  const branchQuery = trpc.branches.getAll.useQuery(
    {
      projectId: currentProject.id,
    },
    {
      enabled: !!currentProject.id,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  const initialBranches: Partial<BranchProps> = {
    branches: branchQuery.data ?? [],
  };

  const storeRef = useRef<BranchStore>();
  if (!storeRef.current) {
    storeRef.current = createBranchStore(initialBranches);
  }

  console.log(storeRef.current, "-----this is storeRef.current-----");

  // const store = useRef(createBranchStore(initialBranches)).current;

  // console.log("---this is store Project.tsx---", store);

  if (status === "authenticated") {
    return (
      <BranchesProvider branches={branchQuery.data ?? []}>
        <Container>
          <Nav
            user={user}
            currentProject={currentProject}
            projects={projects}
          />
        </Container>
        <Tabs
          currentRole={currentRole}
          projectSlug={currentProject?.slug}
          active={tab || "project"}
        />

        <Container>
          <div className="my-10 flex flex-wrap">{children}</div>
        </Container>

        <Toaster position="top-right" />
      </BranchesProvider>
    );
  } else {
    return (
      <div className="flex h-screen w-screen items-center justify-center p-5">
        Loading ...
      </div>
    );
  }
};

export default ProjectLayout;

// Provider wrapper

type BranchesProviderProps = React.PropsWithChildren<Partial<BranchProps>>;

function BranchesProvider({ children, ...props }: BranchesProviderProps) {
  const storeRef = useRef<BranchStore>();
  if (!storeRef.current) {
    storeRef.current = createBranchStore(props);
  }
  return (
    <BranchesContext.Provider value={storeRef.current}>
      {children}
    </BranchesContext.Provider>
  );
}

export function useBranchContext<T>(
  selector: (state: BranchState) => T,
  equalityFn?: (left: T, right: T) => boolean,
): T {
  const store = useContext(BranchesContext);
  if (!store) throw new Error("Missing BearContext.Provider in the tree");
  return useStore(store, selector, equalityFn);
}
