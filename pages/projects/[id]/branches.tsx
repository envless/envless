import { type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
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
import { Badge, Button } from "@/components/theme";
import Table from "@/components/theme/Table/Table";
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
  const [copied, setCopied] = useState("");
  const router = useRouter();
  const branchQuery = trpc.branches.getAll.useQuery(
    {
      projectId: router.query.id as string,
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(value);
    setTimeout(() => setCopied(""), 2000);
  };

  const protectedBranches = [
    {
      id: 1,
      name: "production",
      description: "Used for production environemnts",
      base: "Open",
    },

    {
      id: 2,
      name: "staging",
      description: "Used for staging environemnts",
      base: "Closed",
    },

    {
      id: 3,
      name: "review",
      description: "Used by review apps",
      base: "Merged",
    },

    {
      id: 4,
      name: "public",
      description: "Used by developers and open source contributors",
      base: "Merged",
    },
  ];

  const branchesColumns: ColumnDef<Branch & { createdBy: User }>[] = [
    {
      id: "details",
      accessorFn: (row) => `${row.name} ${row.createdBy.name}`,
      header: "Details",
      cell: (info) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <Badge type="info">
              <GitBranch className="h-6 w-6" strokeWidth={2} />
            </Badge>
          </div>
          <div className="ml-4">
            <button className="inline-flex cursor-copy font-medium">
              <Copy className="mr-2 h-4 w-4" strokeWidth={2} />
              {info.row.original.name}
            </button>
            <div className="text-light">
              Created by {info.row.original.createdBy.name} ago
            </div>
          </div>
        </div>
      ),
    },

    {
      id: "actions",
      header: "Action",
      cell: () => (
        <Button secondary={true} small className="float-right border-lighter">
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
            <button
              onClick={() => {
                copyToClipboard(info.row.original.name as string);
              }}
              className="inline-flex cursor-copy font-medium"
            >
              {copied === info.row.original.name ? (
                <CheckCheck
                  className="mr-2 h-4 w-4 text-teal-400"
                  strokeWidth={2}
                />
              ) : (
                <Copy className="mr-2 h-4 w-4" strokeWidth={2} />
              )}

              {info.row.original.name}
            </button>
            <div className="text-light">{info.row.original.description}</div>
          </div>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <a href="#" className="float-right pr-4 hover:text-teal-400">
          <Settings2 className="h-5 w-5" strokeWidth={2} />
          <span className="sr-only">, {info.row.original.name}</span>
        </a>
      ),
    },
  ];

  return (
    <ProjectLayout
      tab="branches"
      projects={projects}
      currentProject={currentProject}
    >
      <div className="w-full">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-6">
            <h1 className="text-lg">Protected branches</h1>
          </div>

          <div className="col-span-6">
            <Button
              className="float-right"
              onClick={() => console.log("Invite")}
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
            <h1 className="text-lg">All branches</h1>
          </div>

          <div className="col-span-6">
            <Button
              className="float-right"
              onClick={() => console.log("Invite")}
            >
              <GitBranchPlus className="mr-2 h-4 w-4 " strokeWidth={2} />
              Create new branch
            </Button>
          </div>
        </div>
        <div className="mt-3 flex flex-col">
          <Table columns={branchesColumns} data={branchQuery.data || []} />
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
