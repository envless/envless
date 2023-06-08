import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { useBranches } from "@/hooks/useBranches";
import useCopyToClipBoard from "@/hooks/useCopyToClipBoard";
import { useSeperateBranches } from "@/hooks/useSeperateBranches";
import ProjectLayout from "@/layouts/Project";
import { useBranchesStore } from "@/store/Branches";
import { trpc } from "@/utils/trpc";
import { withAccessControl } from "@/utils/withAccessControl";
import { MembershipStatus, Project, UserRole } from "@prisma/client";
import {
  CheckCheck,
  Copy,
  GitBranch,
  GitBranchPlus,
  Settings2,
  ShieldCheck,
  Trash,
} from "lucide-react";
import DateTimeAgo from "@/components/DateTimeAgo";
import CreateBranchModal from "@/components/branches/CreateBranchModal";
import CreatePullRequestModal from "@/components/pulls/CreatePullRequestModal";
import { Badge, Button } from "@/components/theme";
import { type FilterOptions, Table } from "@/components/theme/Table/Table";
import { showToast } from "@/components/theme/showToast";

const filterOptions: FilterOptions = {
  sort: [
    { label: "Newest", value: "createdAt", order: "desc" },
    { label: "Oldest", value: "createdAt", order: "asc" },
    { label: "Recently Updated", value: "updatedAt", order: "desc" },
    { label: "Least recently updated", value: "updatedAt", order: "asc" },
  ],
};

/**
 * A functional component that represents a project.
 * @param {Props} props - The props for the component.
 * @param {Projects} props.projects - The projects the user has access to.
 * @param {currentProject} props.currentProject - The current project.
 * @param {currentRole} props.currentRole - The user role in current project.
 */

interface Props {
  projects: Project[];
  currentProject: Project;
  currentRole: UserRole;
}

export const BranchesPage = ({
  projects,
  currentProject,
  currentRole,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPrModalOpen, setIsPrModalOpen] = useState(false);
  const [fetching, setFetching] = useState(false);

  const router = useRouter();
  const [copiedValue, copy, setCopiedValue] = useCopyToClipBoard();
  const utils = trpc.useContext();
  const { setCurrentBranch } = useBranchesStore();

  const projectSlug = router.query.slug as string;

  const { allBranches, refetchBranches } = useBranches({ currentProject });

  const branchDeleteMutation = trpc.branches.delete.useMutation({
    onSuccess: (data) => {
      setFetching(false);
      refetchBranches();
      showToast({
        type: "success",
        title: "Branch successfully deleted",
        subtitle: `Branch '${data.name}' has been deleted`,
      });
    },
    onError: (error) => {
      setFetching(false);
      showToast({
        type: "error",
        title: "Failed to delete branch",
        subtitle: error.message,
      });
    },
  });

  const { protected: protectedBranches, unprotected: allOtherBranches } =
    useSeperateBranches(allBranches);

  const branchesColumnVisibility = {
    details: true,
    author: false,
    createdAt: false,
    updatedAt: false,
    status: false,
    protected: false,
  };

  const branchesColumns = useMemo(
    () => [
      {
        id: "author",
        accessorFn: (row) => row.createdBy.name,
      },
      {
        id: "protected",
        accessorFn: (row) => row.protected,
      },
      {
        id: "createdAt",
        accessorFn: (row) => row.createdAt,
      },
      {
        id: "updatedAt",
        accessorFn: (row) => row.updatedAt,
      },
      {
        id: "status",
        accessorFn: (row) => row.status,
      },
      {
        id: "details",
        accessorFn: (row) => `${row.name}`,
        header: "Details",
        cell: (info) => (
          <div className="flex items-center">
            <div className="h-10 w-10 flex-shrink-0">
              <Badge type="info">
                <GitBranch className="h-6 w-6" strokeWidth={2} />
              </Badge>
            </div>
            <div className="ml-4">
              <div className="flex items-center">
                {copiedValue === info.row.original.name ? (
                  <button
                    aria-label="Copied!"
                    data-balloon-pos="down"
                    className="inline-flex cursor-copy font-medium"
                  >
                    <CheckCheck
                      className="mr-2 h-4 w-4 text-teal-400"
                      strokeWidth={2}
                    />
                  </button>
                ) : (
                  <button className="inline-flex cursor-copy font-medium">
                    <Copy
                      onClick={() => {
                        copy(info.row.original.name as string);
                        setTimeout(() => {
                          setCopiedValue("");
                        }, 2000);
                      }}
                      className="mr-2 h-4 w-4"
                      strokeWidth={2}
                    />
                  </button>
                )}
                {info.row.original.name}
              </div>
              <div className="text-light">
                Created by {info.row.original.createdBy.name}{" "}
                <DateTimeAgo date={info.row.original.createdAt} />
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "actions",
        header: "Action",
        cell: (info) => (
          <Button
            onClick={() => {
              setCurrentBranch(info.row.original);
              setIsPrModalOpen(true);
            }}
            variant="primary-outline"
            size="sm"
            className="float-right"
          >
            Open pull request
          </Button>
        ),
      },
      {
        id: "deleteBranch",
        header: "Delete Branch",
        cell: (info) => (
          <button
            onClick={() => {
              const confirmed = window.confirm(
                "Are you sure you want to delete this branch?",
              );
              if (confirmed) {
                branchDeleteMutation.mutate({
                  branchId: info.row.original.id,
                  projectId: currentProject.id,
                });
              }
            }}
            className="float-right cursor-pointer pr-4 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={fetching}
          >
            <Trash />
            <span className="sr-only">Delete branch</span>
          </button>
        ),
      },
    ],
    [
      branchDeleteMutation,
      copiedValue,
      copy,
      fetching,
      setCopiedValue,
      setCurrentBranch,
    ],
  );

  const protectedBranchesColumns = [
    {
      id: "name",
      header: "name",
      cell: (info) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <Badge type="success">
              <ShieldCheck className="h-6 w-6" strokeWidth={2} />
            </Badge>
          </div>
          <div className="ml-4">
            <div className="flex items-center">
              {copiedValue === info.row.original.name ? (
                <button
                  aria-label="Copied!"
                  data-balloon-pos="down"
                  className="inline-flex cursor-copy font-medium"
                >
                  <CheckCheck
                    className="mr-2 h-4 w-4 text-teal-400"
                    strokeWidth={2}
                  />
                </button>
              ) : (
                <button className="inline-flex cursor-copy font-medium">
                  <Copy
                    onClick={() => {
                      copy(info.row.original.name as string);
                      setTimeout(() => {
                        setCopiedValue("");
                      }, 2000);
                    }}
                    className="mr-2 h-4 w-4"
                    strokeWidth={2}
                  />
                </button>
              )}
              {info.row.original.name}
            </div>
            <div className="text-light">
              Created by {info.row.original.createdBy.name}{" "}
              <DateTimeAgo date={info.row.original.createdAt} />
            </div>
            <div className="text-light">{info.row.original.description}</div>
          </div>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <Link
          href={`/projects/${info.row.original.project.slug}/settings/protected-branch`}
          className="float-right pr-4 hover:text-teal-400"
        >
          <Settings2 className="h-5 w-5" strokeWidth={2} />
          <span className="sr-only">, {info.row.original.name}</span>
        </Link>
      ),
    },
  ];

  return (
    <ProjectLayout
      tab="project"
      projects={projects}
      currentProject={currentProject}
      currentRole={currentRole}
    >
      <CreateBranchModal
        onSuccessCreation={() => {
          utils.branches.getAll.invalidate();
        }}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <CreatePullRequestModal
        onSuccessCreation={(pullRequest) => {
          router.push(
            `/projects/${pullRequest.project.slug}/pulls/${pullRequest.prId}`,
          );
        }}
        isOpen={isPrModalOpen}
        setIsOpen={setIsPrModalOpen}
      />

      <div className="w-full">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-6">
            <h1 className="text-lg">Protected branches</h1>
          </div>

          <div className="col-span-6">
            <Button
              className="float-right"
              leftIcon={
                <GitBranchPlus className="mr-2 h-4 w-4 " strokeWidth={2} />
              }
              onClick={() => {
                router.push(
                  `/projects/${router.query.slug}/settings/protected-branch`,
                );
              }}
            >
              Protect branches
            </Button>
          </div>
        </div>

        <div className="mt-3 flex flex-col">
          <Table
            variant="darker"
            hasFilters={false}
            columns={protectedBranchesColumns}
            data={protectedBranches}
            emptyStateProps={{
              title: "No protected branches yet.",
              icon: GitBranchPlus,
              description: "You can start protecting your branches",
              actionText: "from project settings page.",
              onActionClick: () => {
                router.push(
                  `/projects/${projectSlug}/settings/protected-branch`,
                );
              },
            }}
          />
        </div>

        <div className="mt-8 grid grid-cols-12 gap-2">
          <div className="col-span-6">
            <h1 className="text-lg">All other branches</h1>
          </div>

          <div className="col-span-6">
            <Button
              leftIcon={
                <GitBranchPlus className="mr-2 h-4 w-4" strokeWidth={2} />
              }
              className="float-right"
              onClick={() => setIsOpen(true)}
            >
              Create new branch
            </Button>
          </div>
        </div>
        <div className="mt-3 flex flex-col">
          <Table
            visibleColumns={branchesColumnVisibility}
            columns={branchesColumns}
            data={allOtherBranches || []}
            filterOptions={filterOptions}
            emptyStateProps={{
              title: "No branches yet.",
              icon: GitBranchPlus,
              actionText: "creating a new branch.",
              onActionClick: () => setIsOpen(true),
            }}
          />
        </div>
      </div>
    </ProjectLayout>
  );
};

export const getServerSideProps = withAccessControl({
  hasAccess: {
    roles: [
      UserRole.maintainer,
      UserRole.developer,
      UserRole.guest,
      UserRole.owner,
    ],
    statuses: [MembershipStatus.active],
  },
});

export default BranchesPage;
