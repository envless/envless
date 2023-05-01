import { type GetServerSidePropsContext } from "next";
import { Fragment, useEffect, useState } from "react";
import { decryptString, generateKey } from "@47ng/cloak";
import { useBranches } from "@/hooks/useBranches";
import ProjectLayout from "@/layouts/Project";
import Project from "@/models/projects";
import { getOne as getSinglePr } from "@/models/pullRequest";
import { getServerSideSession } from "@/utils/session";
import { trpc } from "@/utils/trpc";
import { withAccessControl } from "@/utils/withAccessControl";
import {
  type Branch,
  type EncryptedProjectKey,
  MembershipStatus,
  Project as ProjectType,
  PullRequest,
  Secret,
  type UserPublicKey,
  UserRole,
} from "@prisma/client";
import { GitMerge, GitPullRequestClosed } from "lucide-react";
import { UserType } from "prisma/seeds/types";
import DetailedPrTitle from "@/components/pulls/DetailedPrTitle";
import EnvDiffViewer from "@/components/pulls/EnvDiffViewer";
import { Button } from "@/components/theme";
import OpenPGP from "@/lib/encryption/openpgp";
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
  privateKey: string;
  encryptedProjectKey: EncryptedProjectKey;
}

interface DecryptionResult {
  success: boolean;
  plaintext?: string;
  error?: Error;
}

async function decryptEncryptedString(
  encryptedString: string,
  privateKey: string,
): Promise<DecryptionResult> {
  try {
    const decryptedProjectkey = (await OpenPGP.decrypt(
      encryptedString,
      privateKey,
    )) as string;
    return { success: true, plaintext: decryptedProjectkey };
  } catch (error) {
    return { success: false, error };
  }
}

export default function PullRequestDetailPage({
  projects,
  currentProject,
  currentRole,
  pullRequest,
  baseBranch,
  currentBranch,
  privateKey,
  encryptedProjectKey,
}: Props) {
  const { allBranches } = useBranches({ currentProject });

  const [oldCode, setOldCode] = useState("");
  const [newCode, setNewCode] = useState("");

  useEffect(() => {
    const decryptSecrets = async () => {
      const decryptedOldCode: string[] = [];
      const decryptedNewCode: string[] = [];

      for (const secret of baseBranch.secrets) {
        const decryptedKey = await decryptEncryptedString(
          secret.encryptedKey,
          privateKey,
        );
        const decryptedValue = await decryptEncryptedString(
          secret.encryptedValue,
          privateKey,
        );
        // console.log(privateKey);
        if (decryptedKey.success && decryptedValue.success) {
          decryptedOldCode.push(`${decryptedKey}=${decryptedValue}`);
        }
      }

      for (const secret of currentBranch.secrets) {
        const decryptedKey = await decryptEncryptedString(
          secret.encryptedKey,
          privateKey,
        );
        const decryptedValue = await decryptEncryptedString(
          secret.encryptedValue,
          privateKey,
        );
        if (decryptedKey.success && decryptedValue.success) {
          decryptedNewCode.push(`${decryptedKey}=${decryptedValue}`);
        }
      }

      setOldCode(decryptedOldCode.join("\n"));
      setNewCode(decryptedNewCode.join("\n"));
    };

    decryptSecrets();
  }, [baseBranch, currentBranch, privateKey]);

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
                  leftIcon={
                    <GitPullRequestClosed
                      className="mr-2 h-4 w-4"
                      strokeWidth={2}
                    />
                  }
                  variant="danger-outline"
                  className="float-right"
                >
                  Close pull request
                </Button>
                <Button
                  leftIcon={
                    <GitMerge className="mr-2 h-4 w-4" strokeWidth={2} />
                  }
                  variant="primary"
                  className="float-right"
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
  const session = await getServerSideSession(context);
  const user = session?.user;

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

  const currentProject = await prisma.project.findFirst({
    where: { slug: projectSlug as string },
    select: {
      id: true,
      encryptedProjectKey: {
        select: { id: true, encryptedKey: true },
      },
    },
  });

  const userPublicKey = await prisma.userPublicKey.findFirst({
    where: { userId: user?.id },
    select: { key: true },
  });

  const publicKey = userPublicKey?.key;
  let encryptedProjectKey = currentProject?.encryptedProjectKey;

  if (publicKey && !encryptedProjectKey) {
    const decryptedProjectKey = await generateKey();

    const encryptedKey = (await OpenPGP.encrypt(decryptedProjectKey, [
      publicKey,
    ])) as string;

    encryptedProjectKey = await prisma.encryptedProjectKey.create({
      data: {
        encryptedKey,
        projectId: currentProject?.id as string,
      },
    });
  }

  return {
    props: {
      pullRequest: JSON.parse(JSON.stringify(pullRequest)),
      baseBranch: JSON.parse(JSON.stringify(baseBranch)),
      currentBranch: JSON.parse(JSON.stringify(currentBranch)),
      privateKey: user?.privateKey,
      encryptedProjectKey,
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
