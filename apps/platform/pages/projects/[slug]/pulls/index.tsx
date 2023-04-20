import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import ProjectLayout from "@/layouts/Project";
import { trpc } from "@/utils/trpc";
import { withAccessControl } from "@/utils/withAccessControl";
import {
  Project,
  PullRequest,
  PullRequestStatus,
  User,
  UserRole,
} from "@prisma/client";
import * as HoverCard from "@radix-ui/react-hover-card";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowLeft,
  GitMerge,
  GitPullRequest,
  GitPullRequestClosed,
} from "lucide-react";
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
  hasAccess: { owner: true, maintainer: true, developer: true, guest: true },
});

export default PullRequestPage;

interface PullRequestHoverCardProps {
  triggerComponent: ReactNode;
}

function PullRequestHoverCard({ triggerComponent }: PullRequestHoverCardProps) {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger asChild>{triggerComponent}</HoverCard.Trigger>

      <HoverCard.Portal>
        <HoverCard.Content
          className="bg-darker w-[350px] rounded text-xs"
          sideOffset={5}
        >
          <div className="flex w-full flex-col gap-[10px] px-3 py-4">
            <div className="text-light">
              <Link href={"#"} className="underline">
                envless/envless
              </Link>{" "}
              on Feb 22
            </div>

            <div className="flex items-start gap-[10px]">
              <div className="shrink-0">
                <GitPullRequest className="h-4 w-4 text-emerald-200" />
              </div>

              <div className="flex flex-col">
                <p className="text-md font-bold">
                  feat: additional security - ask users to provide OTP for one
                  last time before they disable two factor auth{" "}
                </p>
                <div className="mt-2 inline-flex items-center gap-2">
                  <span className="bg-dark text-light rounded px-1 py-0.5">
                    envless:main
                  </span>
                  <ArrowLeft className="text-lighter h-4 w-4 shrink-0" />
                  <span className="bg-dark text-light rounded px-1 py-0.5">
                    samyogdhital:proj...
                  </span>
                </div>
              </div>
            </div>
          </div>

          <HoverCard.Arrow className="text-dark" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
