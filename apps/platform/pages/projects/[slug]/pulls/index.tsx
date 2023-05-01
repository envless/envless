import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import ProjectLayout from "@/layouts/Project";
import { trpc } from "@/utils/trpc";
import { withAccessControl } from "@/utils/withAccessControl";
import {
  MembershipStatus,
  Project,
  PullRequest,
  PullRequestStatus,
  User,
  UserRole,
} from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { GitMerge, GitPullRequest, GitPullRequestClosed } from "lucide-react";
import DateTimeAgo from "@/components/DateTimeAgo";
import CreatePullRequestModal from "@/components/pulls/CreatePullRequestModal";
import PullRequestTitleHoverCard from "@/components/pulls/PullRequestTitleHoverCard";
import { Badge, Button, Label } from "@/components/theme";
import { FilterOptions, Table } from "@/components/theme/Table/Table";

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

export const PullRequestPage = ({
  projects,
  currentProject,
  currentRole,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pullRequestQuery = trpc.pullRequest.getAll.useQuery(
    {
      projectId: currentProject.id,
    },
    {
      refetchOnWindowFocus: false,
    },
  );

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
              projectSlug={currentProject.slug}
              projectName={currentProject.name}
              pullRequestStatus={info.row.original.status as string}
              pullRequestTitle={info.row.original.title}
              triggerComponent={
                <Link
                  href={`/projects/${projectSlug}/pulls/${info.row.original.prId}`}
                  className="font-medium"
                >
                  {info.row.original.title}
                </Link>
              }
            />
            <div className="text-light">
              #{info.row.original.prId} opened by{" "}
              {info.row.original.createdBy.name}{" "}
              <DateTimeAgo date={info.row.original.createdAt} />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "createdAt",
      accessorFn: (row) => row.createdAt,
    },
    {
      id: "createdBy",
      accessorFn: (row) => row.createdBy.name,
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

  const projectSlug = router.query.slug as string;

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
      tab="pr"
      projects={projects}
      currentProject={currentProject}
      currentRole={currentRole}
    >
      <CreatePullRequestModal
        onSuccessCreation={(pullRequest) => {
          router.push(
            `/projects/${pullRequest.project.slug}/pulls/${pullRequest.prId}`,
          );
        }}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <div className="w-full">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-6">
            <h1 className="text-lg">Pull requests</h1>
          </div>

          <div className="col-span-6">
            <Button
              className="float-right"
              leftIcon={
                <GitPullRequest className="mr-2 h-4 w-4" strokeWidth={2} />
              }
              onClick={() => setIsOpen(true)}
            >
              Open pull request
            </Button>
          </div>
        </div>

        <Table
          columns={pullRequestColumns}
          data={pullRequestQuery.data ?? []}
          filterOptions={filterOptions}
          visibleColumns={{
            title: true,
            status: true,
            author: true,
            createdAt: false,
          }}
          emptyStateProps={{
            title: "No pull requests yet.",
            icon: GitPullRequest,
            actionText: "creating a pull request",
            onActionClick: () => setIsOpen(true),
          }}
        />
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

export default PullRequestPage;
