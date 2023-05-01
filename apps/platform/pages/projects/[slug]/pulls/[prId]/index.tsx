import { type GetServerSidePropsContext } from "next";
import { Fragment, useEffect, useState } from "react";
import { useBranches } from "@/hooks/useBranches";
import useSecret from "@/hooks/useSecret";
import ProjectLayout from "@/layouts/Project";
import Project from "@/models/projects";
import { getOne as getSinglePr } from "@/models/pullRequest";
import { trpc } from "@/utils/trpc";
import { withAccessControl } from "@/utils/withAccessControl";
import {
  type Branch,
  MembershipStatus,
  Project as ProjectType,
  PullRequest,
  Secret,
  UserRole,
} from "@prisma/client";
import { GitMerge, GitPullRequestClosed } from "lucide-react";
import { UserType } from "prisma/seeds/types";
import DetailedPrTitle from "@/components/pulls/DetailedPrTitle";
import EnvDiffViewer from "@/components/pulls/EnvDiffViewer";
import { Button } from "@/components/theme";
import { showToast } from "@/components/theme/showToast";
import prisma from "@/lib/prisma";

/**
 * A functional component that represents a pull request detail.
 * @param {Projects} props.projects - The projects the user has access to.
 * @param {PullRequest & {createdBy: User}} props.pullRequest - The projects the user has access to.
 * @param {currentProject} props.currentProject - The current project.
 * @param {currentRole} props.currentRole - The user role in current project.
 */

interface Props {
  projects: ProjectType[];
  pullRequest:
    | (PullRequest & {
        createdBy: UserType;
      })
    | null;
  baseBranch: Branch & { secrets: Secret[] };
  currentBranch: Branch & { secrets: Secret[] };
  currentProject: ProjectType;
  currentRole: UserRole;
}

export default function PullRequestDetailPage({
  projects,
  currentProject,
  currentRole,
  pullRequest,
  baseBranch,
  currentBranch,
}: Props) {
  const [oldCode, setOldCode] = useState("");
  const [newCode, setNewCode] = useState("");

  useBranches({ currentProject });

  const { secrets: baseBranchSecrets } = useSecret({ branchId: baseBranch.id });
  const { secrets: currentBranchSecrets } = useSecret({
    branchId: currentBranch.id,
  });

  const {
    mutate: closePullRequestMutation,
    isLoading: loadingClosePullRequest,
  } = trpc.pullRequest.close.useMutation({
    onSuccess: () => {
      showToast({
        type: "success",
        title: "Pull Request successfully closed",
        subtitle: `Pull Request closed`,
      });
    },

    onError: (error) => {
      showToast({
        type: "error",
        title: "Something went wrong",
        subtitle: "Failed to close this Pull Request",
      });
    },
  });

  const {
    mutate: mergePullRequestMutation,
    isLoading: loadingMergePullRequest,
  } = trpc.pullRequest.merge.useMutation({
    onSuccess: () => {
      showToast({
        type: "success",
        title: "Pull Request successfully merged",
        subtitle: `Pull Request merged`,
      });
    },

    onError: (error) => {
      showToast({
        type: "error",
        title: "Something went wrong",
        subtitle: "Failed to merge this Pull Request",
      });
    },
  });

  useEffect(() => {
    const decryptSecrets = async () => {
      const decryptedOldCode: string[] = [];
      const decryptedNewCode: string[] = [];

      for (const oldSecret of baseBranchSecrets) {
        decryptedOldCode.push(
          `${oldSecret.decryptedKey}=${oldSecret.decryptedValue}`,
        );
      }

      for (const newSecret of currentBranchSecrets) {
        decryptedNewCode.push(
          `${newSecret.decryptedKey}=${newSecret.decryptedValue}`,
        );
      }

      setOldCode(decryptedOldCode.join("\n"));
      setNewCode(decryptedNewCode.join("\n"));
    };

    decryptSecrets();
  }, [baseBranch, baseBranchSecrets, currentBranch, currentBranchSecrets]);

  return (
    <ProjectLayout
      tab="pr"
      projects={projects}
      currentProject={currentProject}
      currentRole={currentRole}
    >
      {!pullRequest ? (
        <div>Nothing here</div>
      ) : (
        <Fragment>
          <div className="w-full">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-2">
              <div className="col-span-8">
                <DetailedPrTitle
                  author={pullRequest.createdBy.name}
                  title={pullRequest.title}
                  prId={pullRequest.prId}
                  status={pullRequest.status}
                  base={baseBranch}
                  current={currentBranch}
                />
              </div>
              <div className="col-span-12 flex items-start gap-3 md:col-span-4">
                <Button
                  onClick={() => {
                    closePullRequestMutation({
                      prId: pullRequest.prId,
                      projectId: currentProject.id,
                    });
                  }}
                  leftIcon={
                    <GitPullRequestClosed
                      className="mr-2 h-4 w-4"
                      strokeWidth={2}
                    />
                  }
                  variant="danger-outline"
                  className="float-right"
                  disabled={loadingClosePullRequest || loadingMergePullRequest}
                >
                  Close pull request
                </Button>
                <Button
                  onClick={() => {
                    mergePullRequestMutation({
                      baseBranchId: baseBranch.id,
                      currentBranchId: currentBranch.id,
                      prId: pullRequest.prId,
                      projectId: currentProject.id,
                    });
                  }}
                  leftIcon={
                    <GitMerge className="mr-2 h-4 w-4" strokeWidth={2} />
                  }
                  variant="primary"
                  className="float-right"
                  disabled={loadingMergePullRequest || loadingClosePullRequest}
                >
                  Merge pull request
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 w-full">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-12">
                <EnvDiffViewer
                  oldCode={oldCode}
                  newCode={newCode}
                  leftTitle={baseBranch.name}
                  rightTitle={currentBranch.name}
                />
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </ProjectLayout>
  );
}

const getPageServerSideProps = async (context: GetServerSidePropsContext) => {
  // @ts-ignore
  const { slug: projectSlug, prId } = context.params;

  const project = await Project.findBySlug(projectSlug);
  const projectId = project.id;

  const pullRequest = await getSinglePr({ projectId, prId: Number(prId) });

  let baseBranch: Branch | null = null;
  let currentBranch: Branch | null = null;

  if (pullRequest) {
    baseBranch = await prisma.branch.findFirst({
      where: { id: pullRequest.baseBranchId },
      include: { secrets: true },
    });

    currentBranch = await prisma.branch.findFirst({
      where: { id: pullRequest.currentBranchId },
      include: { secrets: true },
    });
  }

  return {
    props: {
      pullRequest: JSON.parse(JSON.stringify(pullRequest)),
      baseBranch: JSON.parse(JSON.stringify(baseBranch)),
      currentBranch: JSON.parse(JSON.stringify(currentBranch)),
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
