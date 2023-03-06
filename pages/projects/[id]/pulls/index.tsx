import { type GetServerSidePropsContext } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import ProjectLayout from "@/layouts/Project";
import { getServerSideSession } from "@/utils/session";
import { trpc } from "@/utils/trpc";
import { Project, PullRequest, PullRequestStatus, User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { GitMerge, GitPullRequest, GitPullRequestClosed } from "lucide-react";
import CreatePullRequestModal from "@/components/pulls/CreatePullRequestModal";
import PullRequestTitleHoverCard from "@/components/pulls/PullRequestTitleHoverCard";
import { Badge, Button, Label } from "@/components/theme";
import { FilterOptions, Table } from "@/components/theme/Table/Table";
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

export const PullRequestPage = ({ projects, currentProject }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pullRequestQuery = trpc.pullRequest.getAll.useQuery(
    {
      projectId: router.query.id as string,
    },
    {
      refetchOnWindowFocus: false,
    },
  );
  const pullRequests = [
    {
      id: 1,
      title: "Add NODE_ENV, REDIS_URL and others",
      subtitle: "#60 opened 2 minutes ago by Lindsay Walton",
      status: "Open",
    },

    {
      id: 2,
      title: "Remove GITHUB_ACCESS_TOKEN",
      subtitle: "#59 closed 1 day ago by John Doe",
      status: "Closed",
    },

    {
      id: 3,
      title: "Rotate ENCRYPTON_KEY",
      subtitle: "#58 merged 2 days ago by Jane Doe",
      status: "Merged",
    },
  ];

  const projectId = router.query.id as string;

  const pullRequestColumns: ColumnDef<PullRequest & { createdBy: User }>[] = [
    {
      id: "title",
      accessorFn: (row) => row.title,
      cell: (info) => (
        <div className="flex max-w-3xl items-center">
          <div className="h-10 w-10 flex-shrink-0">
            {info.row.original.status === PullRequestStatus.open && (
              <Badge type="success">
                <GitPullRequest className="h-6 w-6" strokeWidth={2} />
              </Badge>
            )}

            {info.row.original.status === PullRequestStatus.closed && (
              <Badge type="danger">
                <GitPullRequestClosed className="h-6 w-6" strokeWidth={2} />
              </Badge>
            )}

            {info.row.original.status === PullRequestStatus.merged && (
              <Badge type="info">
                <GitMerge className="h-6 w-6" strokeWidth={2} />
              </Badge>
            )}
          </div>
          <div className="ml-4 truncate">
            <PullRequestTitleHoverCard
              triggerComponent={
                <Link
                  href={`/projects/${projectId}/pulls/${info.row.original.id}`}
                  className="font-medium"
                >
                  {info.row.original.title}
                </Link>
              }
            />
            <div className="text-light">
              #205 opened 3 hours ago by chetannn
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "status",
      accessorFn: (row) => row.status,
      cell: (info) => (
        <>
          {info.row.original.status === PullRequestStatus.open && (
            <Label type="success">{info.row.original.status}</Label>
          )}

          {info.row.original.status === PullRequestStatus.closed && (
            <Label type="danger">{info.row.original.status}</Label>
          )}

          {info.row.original.status === PullRequestStatus.merged && (
            <Label type="info">{info.row.original.status}</Label>
          )}
        </>
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
    <ProjectLayout tab="pr" projects={projects} currentProject={currentProject}>
      <CreatePullRequestModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="w-full">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-6">
            <h1 className="text-lg">Pull requests</h1>
          </div>

          <div className="col-span-6">
            <Button className="float-right" onClick={() => setIsOpen(true)}>
              <GitPullRequest className="mr-2 h-4 w-4 " strokeWidth={2} />
              Open pull request
            </Button>
          </div>
        </div>

        <Table
          columns={pullRequestColumns}
          data={pullRequestQuery.data ?? []}
          filterOptions={filterOptions}
          visibleColumns={{ title: true, status: true }}
        />
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

  if (!access) {
    return {
      redirect: {
        destination: "/projects",
        permanent: false,
      },
    };
  }

  const projects = access.map((a) => a.project);
  const currentProject = projects.find((p) => p.id === id);

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

export default PullRequestPage;
