import { type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { Fragment } from "react";
import ProjectLayout from "@/layouts/Project";
import Project from "@/models/projects";
import { getOne as getSinglePr } from "@/models/pullRequest";
import { UserType } from "@/types/resources";
import { trpc } from "@/utils/trpc";
import { withAccessControl } from "@/utils/withAccessControl";
import {
  Branch,
  MembershipStatus,
  Project as ProjectType,
  PullRequest,
  PullRequestStatus,
  UserRole,
} from "@prisma/client";
import { GitPullRequest, GitPullRequestClosed } from "lucide-react";
import DetailedPrTitle from "@/components/pulls/DetailedPrTitle";
import EnvDiffViewer from "@/components/pulls/EnvDiffViewer";
import { Button } from "@/components/theme";
import { showToast } from "@/components/theme/showToast";

/**
 * A functional component that represents a pull request detail.
 * @param {Projects} props.projects - The projects the user has access to.
 * @param {PullRequest & {createdBy: User}} props.pullRequest - The projects the user has access to.
 * @param {currentProject} props.currentProject - The current project.
 * @param {currentRole} props.currentRole - The user role in current project.
 */

interface Props {
  projects: ProjectType[];
  pullRequest: PullRequest & {
    createdBy: UserType;
  };
  currentProject: ProjectType;
  currentRole: UserRole;
}

export default function PullRequestDetailPage({
  projects,
  currentProject,
  currentRole,
  pullRequest,
}: Props) {
  const router = useRouter();
  const { baseBranch, currentBranch } = pullRequest as any & {
    baseBranch: Branch;
    currentBranch: Branch;
  };

  const { mutateAsync: mergePrMutationAync, isLoading: isMergePrLoading } =
    trpc.pullRequest.merge.useMutation({
      onSuccess: (data) => {
        showToast({
          type: "success",
          title: "Pull Request Merged",
          subtitle: `Pull Request #${data.prId} merged successfully`,
        });
      },
      onError: (error) => {
        showToast({
          type: "error",
          title: "Failed to merge pull request",
          subtitle: error.message,
        });
      },
    });

  const { mutateAsync: closePrMutateAsync, isLoading: isClosePrLoading } =
    trpc.pullRequest.close.useMutation({
      onSuccess: (data) => {
        showToast({
          type: "success",
          title: "Pull Request Closed",
          subtitle: `Pull Request #${data.prId} closed successfully`,
        });
      },
      onError: (error) => {
        showToast({
          type: "error",
          title: "Failed to close pull request",
          subtitle: error.message,
        });
      },
    });

  const { mutateAsync: reOpenPrMutateAsync, isLoading: isReOpenPrLoading } =
    trpc.pullRequest.reOpen.useMutation({
      onSuccess: (data) => {
        showToast({
          type: "success",
          title: "Pull Request Re-Opened",
          subtitle: `Pull Request #${data.prId} re-opened successfully`,
        });

        router.replace(router.asPath);
      },
      onError: (error) => {
        showToast({
          type: "error",
          title: "Failed to re-open pull request",
          subtitle: error.message,
        });
      },
    });

  return (
    <ProjectLayout
      tab="pr"
      projects={projects}
      currentProject={currentProject}
      currentRole={currentRole}
    >
      <div className="w-full">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-6">
            <DetailedPrTitle
              author={pullRequest.createdBy.name}
              title={pullRequest.title}
              prId={pullRequest.prId}
              status={pullRequest.status}
              base={baseBranch?.name}
              current={currentBranch?.name}
            />
          </div>

          <div className="col-span-6 gap-2">
            {pullRequest.status === PullRequestStatus.open && (
              <Fragment>
                <Button
                  loading={isMergePrLoading}
                  onClick={async () => {
                    await mergePrMutationAync({
                      pullRequest,
                    });
                  }}
                  className="float-right ml-3"
                  leftIcon={
                    <GitPullRequest className="mr-2 h-4 w-4" strokeWidth={2} />
                  }
                >
                  Merge pull request
                </Button>

                <Button
                  leftIcon={
                    <GitPullRequestClosed
                      className="mr-2 h-4 w-4"
                      strokeWidth={2}
                    />
                  }
                  variant="danger-outline"
                  className="float-right"
                  loading={isClosePrLoading}
                  onClick={async () => {
                    const prToClose = {
                      prId: pullRequest.prId,
                      projectId: currentProject.id,
                    };

                    await closePrMutateAsync({ pullRequest: prToClose });
                  }}
                >
                  Close pull request
                </Button>
              </Fragment>
            )}

            {pullRequest.status === PullRequestStatus.closed && (
              <Button
                loading={isReOpenPrLoading}
                onClick={async () => {
                  await reOpenPrMutateAsync({
                    pullRequest,
                  });
                }}
                className="float-right"
              >
                Re-open pull request
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 w-full">
        <EnvDiffViewer baseBranch={baseBranch} currentBranch={currentBranch} />
      </div>
    </ProjectLayout>
  );
}

const getPageServerSideProps = async (context: GetServerSidePropsContext) => {
  // @ts-ignore
  const { slug: projectSlug, prId } = context.params;

  const project = await Project.findBySlug(projectSlug);
  const projectId = project.id;

  const pullRequest = await getSinglePr({ projectId, prId: Number(prId) });

  return {
    props: {
      pullRequest: JSON.parse(JSON.stringify(pullRequest)),
    },
  };
};

export const getServerSideProps = withAccessControl({
  getServerSideProps: getPageServerSideProps,
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
