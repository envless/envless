import { type GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useCopyToClipBoard from "@/hooks/useCopyToClipBoard";
import ProjectLayout from "@/layouts/Project";
import { getServerSideSession } from "@/utils/session";
import { trpc } from "@/utils/trpc";
import { Branch, Project, User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
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
import { Badge, Button } from "@/components/theme";
import { type FilterOptions, Table } from "@/components/theme/Table/Table";
import prisma from "@/lib/prisma";

/**
 * A functional component that represents a project.
 * @param {Props} props - The props for the component.
 * @param {Projects} props.projects - The projects the user has access to.
 * @param {currentProject} props.currentProject - The current project.
 */

interface Props {
  projects: Project[];
  currentProject: Project;
}

export const BranchesPage = ({ projects, currentProject }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [protectedBranches, setProtectedBranches] = useState<any>([]);
  const [allOtherBranches, setAllOtherBranches] = useState<any>([]);
  const router = useRouter();
  const [copiedValue, copy, setCopiedValue] = useCopyToClipBoard();
  const utils = trpc.useContext();
  const branchQuery = trpc.branches.getAll.useQuery(
    {
      projectId: router.query.id as string,
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    setProtectedBranches(
      branchQuery.data
        ? branchQuery.data.filter((branch) => branch.protected === true)
        : [],
    );
    setAllOtherBranches(
      branchQuery.data
        ? branchQuery.data.filter((branch) => branch.protected === false)
        : [],
    );
  }, [branchQuery.data]);

  const branchesColumnVisibility = {
    details: true,
    author: false,
    createdAt: false,
    updatedAt: false,
    status: false,
    protected: false,
  };

  const branchesColumns: ColumnDef<Branch & { createdBy: User }>[] = [
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
        <Button variant="primary-outline" size="sm" className="float-right">
          Open pull request
        </Button>
      ),
    },
  ];

  const protectedBranchesColumns: ColumnDef<(typeof protectedBranches)[0]>[] = [
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
          href={`/project/${info.row.original.projectId}/settings/protected-branches`}
          className="float-right pr-4 hover:text-teal-400"
        >
          <Settings2 className="h-5 w-5" strokeWidth={2} />
          <span className="sr-only">, {info.row.original.name}</span>
        </Link>
      ),
    },
  ];

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

  return (
    <ProjectLayout
      tab="branches"
      projects={projects}
      currentProject={currentProject}
    >
      <CreateBranchModal
        onSuccessCreation={() => {
          utils.branches.getAll.invalidate();
        }}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
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
                  `/project/${router.query.id}/settings/protected-branches`,
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
          {allOtherBranches.length > 0 ? (
            <Table
              visibleColumns={branchesColumnVisibility}
              columns={branchesColumns}
              data={allOtherBranches || []}
              filterOptions={filterOptions}
            />
          ) : (
            <div className="mx-auto mt-10 w-full max-w-screen-xl border-2 border-darker px-5 py-8 transition duration-300 lg:py-12 xl:px-16">
              <div className="text-center">
                <GitBranchPlus className="mx-auto h-8 w-8" />
                <h3 className="mt-2 text-xl">No other branches yet.</h3>
                <p className="mx-auto mt-1 max-w-md text-sm text-light">
                  You can get started by{" "}
                  <span
                    onClick={() => setIsOpen(true)}
                    className="text-teal-300 transition duration-300 hover:cursor-pointer hover:underline"
                  >
                    creating a new branch.
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProjectLayout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSideSession(context);
  const user = session?.user;

  // @ts-ignore
  const { id } = context.params;

  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  const access = await prisma.access.findMany({
    where: {
      // @ts-ignore
      userId: user.id,
    },
    select: {
      id: true,
      project: {
        select: {
          id: true,
          name: true,
          updatedAt: true,
        },
      },
    },
  });

  const projects = access.map((a) => a.project);
  const currentProject = projects.find((project) => project.id === id);

  if (!currentProject) {
    return {
      redirect: {
        destination: "/projects",
        permanent: false,
      },
    };
  }

  return {
    props: {
      currentProject: JSON.parse(JSON.stringify(currentProject)),
      projects: JSON.parse(JSON.stringify(projects)),
    },
  };
}

export default BranchesPage;
