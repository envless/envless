import { useMemo } from "react";
import { generateKey } from "@47ng/cloak";
import { getServerSideSession } from "@/utils/session";
import { withAccessControl } from "@/utils/withAccessControl";
import {
  type Branch,
  type EncryptedProjectKey,
  MembershipStatus,
  type Project,
  type User,
  type UserPublicKey,
  UserRole,
} from "@prisma/client";
import { ProjectCommon } from "@/components/projects/ProjectCommon";
import OpenPGP from "@/lib/encryption/openpgp";
import prisma from "@/lib/prisma";

/**
 * A functional component that represents a project.
 * @param {Props} props - The props for the component.
 * @param {Projects} props.projects - The projects the user has access to.
 * @param {currentProject} props.currentProject - The current project.
 * @param {currentRole} props.currentRole - The user role in current project.
 */
interface Props {
  user: User;
  projects: Project[];
  currentProject: Project;
  currentRole: UserRole;
  publicKey: UserPublicKey["key"];
  encryptedProjectKey: EncryptedProjectKey;
  branches: Branch[];
  privateKey: string;
}

export const ProjectPage = ({
  user,
  projects,
  currentProject,
  currentRole,
  publicKey,
  encryptedProjectKey,
  branches,
  privateKey,
}: Props) => {
  const mainBranch = useMemo(
    () => branches.find((branch) => (branch.name = "main")),
    [branches],
  )!;

  return (
    <ProjectCommon
      user={user}
      projects={projects}
      currentProject={currentProject}
      currentRole={currentRole}
      publicKey={publicKey}
      encryptedProjectKey={encryptedProjectKey}
      branches={branches}
      privateKey={privateKey}
      currentBranch={mainBranch}
    />
  );
};

export const getServerSideProps = withAccessControl({
  withEncryptedProjectKey: true,
  hasAccess: {
    roles: [
      UserRole.maintainer,
      UserRole.developer,
      UserRole.guest,
      UserRole.owner,
    ],
    statuses: [MembershipStatus.active],
  },
  getServerSideProps: async (context) => {
    const session = await getServerSideSession(context);
    const user = session?.user;
    // @ts-ignore
    const { slug } = context.params;

    const currentProject = await prisma.project.findFirst({
      where: { slug: slug as string },
      select: {
        id: true,
        encryptedProjectKey: {
          select: { id: true, encryptedKey: true },
        },
        branches: {
          select: {
            id: true,
            name: true,
            protected: true,
          },
        },
      },
    });

    const userPublicKey = await prisma.userPublicKey.findFirst({
      where: { userId: user?.id },
      select: { key: true },
    });

    const publicKey = userPublicKey?.key;
    let encryptedProjectKey = currentProject?.encryptedProjectKey;
    const branches = currentProject?.branches;

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
        privateKey: user?.privateKey,
        encryptedProjectKey,
        branches,
      },
    };
  },
});

export default ProjectPage;
