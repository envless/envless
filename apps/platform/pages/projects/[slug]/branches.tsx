import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import useCopyToClipBoard from "@/hooks/useCopyToClipBoard";
import { useSeperateBranches } from "@/hooks/useSeperateBranches";
import ProjectLayout from "@/layouts/Project";
import { trpc } from "@/utils/trpc";
import { withAccessControl } from "@/utils/withAccessControl";
import type { Project, UserRole } from "@prisma/client";
import {
  CheckCheck,
  Copy,
  GitBranch,
  GitBranchPlus,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import DateTimeAgo from "@/components/DateTimeAgo";
import CreateBranchModal from "@/components/branches/CreateBranchModal";
import CreatePullRequestModal from "@/components/pulls/CreatePullRequestModal";
import { Badge, Button } from "@/components/theme";
import { type FilterOptions, Table } from "@/components/theme/Table/Table";

const filterOptions: FilterOptions = {
  status: [
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
    { value: "merged", label: "Merged" },
  ],
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
  const router = useRouter();
  const [copiedValue, copy, setCopiedValue] = useCopyToClipBoard();
  const utils = trpc.useContext();

  const projectSlug = router.query.slug as string;

  const branchQuery = trpc.branches.getAll.useQuery(
    {
      projectId: currentProject.id,
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const { protected: protectedBranches, unprotected: allOtherBranches } =
    useSeperateBranches(branchQuery.data || []);

  const branchesColumnVisibility = {
    details: true,
    author: false,
    createdAt: false,
    updatedAt: false,
    status: false,
    protected: false,
  };

  const branchesColumns = [
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
      cell: () => (
        <Button
          onClick={() => setIsPrModalOpen(true)}
          variant="primary-outline"
          size="sm"
          className="float-right"
        >
          Open pull request
        </Button>
      ),
    },
  ];

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
      tab="branches"
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
        currentProject={currentProject}
      />

      <CreatePullRequestModal
        onSuccessCreation={(pullRequest) => {
          router.push(
            `/projects/${pullRequest.project.slug}/pulls/${pullRequest.id}`,
          );
        }}
        isOpen={isPrModalOpen}
        setIsOpen={setIsPrModalOpen}
        currentProject={currentProject}
      />

      <div className="w-full">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-6">
            <h1 className="text-lg">Protected branches</h1>
          </div>

          <div className="col-span-6">
            <Button
              className="float-right"
              onClick={() => {
                router.push(
                  `/projects/${router.query.slug}/settings/protected-branch`,
                );
              }}
            >
              <GitBranchPlus className="mr-2 h-4 w-4 " strokeWidth={2} />
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
            <Button className="float-right" onClick={() => setIsOpen(true)}>
              <GitBranchPlus className="mr-2 h-4 w-4 " strokeWidth={2} />
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
  hasAccess: { maintainer: true, developer: true, guest: true, owner: true },
});

export default BranchesPage;
