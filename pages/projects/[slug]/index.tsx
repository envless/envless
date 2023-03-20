import { type GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import ProjectLayout from "@/layouts/Project";
import { getServerSideSession } from "@/utils/session";
import { Project } from "@prisma/client";
import { EncryptedProjectKey, PublicKey } from "@prisma/client";
import { GitBranchPlus } from "lucide-react";
import BranchDropdown from "@/components/branches/BranchDropdown";
import CreateBranchModal from "@/components/branches/CreateBranchModal";
import EncryptionSetup from "@/components/projects/EncryptionSetup";
import { EnvironmentVariableEditor } from "@/components/projects/EnvironmentVariableEditor";
import { Button } from "@/components/theme";
import OpenPGP from "@/lib/encryption/openpgp";
import prisma from "@/lib/prisma";

/**
 * A functional component that represents a project.
 * @param {Props} props - The props for the component.
 * @param {Projects} props.projects - The projects the user has access to. @param {currentProject} props.currentProject - The current project. */

interface Props {
  user: object;
  projects: Project[];
  currentProject: Project;
  publicKey: PublicKey["key"];
  encryptedProjectKey: EncryptedProjectKey;
}

interface PersonalKey {
  publicKey: PublicKey["key"];
  privateKey: string;
}

interface ProjectKey {
  decryptedProjectKey: string;
  encryptedProjectKey: EncryptedProjectKey["encryptedKey"];
}

export const ProjectPage = ({
  user,
  projects,
  currentProject,
  publicKey,
  encryptedProjectKey,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [encryptionKeys, setEncryptionKeys] = useState<{
    personal: PersonalKey;
    project: ProjectKey;
  }>({
    personal: {
      publicKey: publicKey,
      privateKey: "",
    },
    project: {
      decryptedProjectKey: "",
      encryptedProjectKey: encryptedProjectKey?.encryptedKey,
    },
  });

  const defaultBranches = [
    { id: 1, name: "main", isSelected: true },
    { id: 2, name: "staging", isSelected: false },
    { id: 3, name: "production", isSelected: false },
    { id: 4, name: "feat/upload-env-file", isSelected: false },
  ];

  const [selectedBranch, setSelectedBranch] = useState(defaultBranches[0]);
  const [branches, setBranches] = useState(defaultBranches);

  useEffect(() => {
    const getPrivateKey = sessionStorage.getItem("privateKey");

    if (getPrivateKey) {
      setEncryptionKeys({
        ...encryptionKeys,
        personal: {
          ...encryptionKeys.personal,
          privateKey: getPrivateKey,
        },
      });
    }
  }, []);

  useEffect(() => {
    (async () => {
      const privateKey = encryptionKeys.personal.privateKey;
      const encryptedProjectKey = encryptionKeys.project.encryptedProjectKey;

      if (privateKey) {
        const decryptedProjectKey = (await OpenPGP.decrypt(
          encryptedProjectKey,
          privateKey,
        )) as string;

        setEncryptionKeys({
          personal: {
            ...encryptionKeys.personal,
          },

          project: {
            ...encryptionKeys.project,
            decryptedProjectKey: decryptedProjectKey,
          },
        });
      }
    })();
  }, [
    encryptionKeys.personal.privateKey,
    encryptionKeys.project.encryptedProjectKey,
  ]);

  return (
    <ProjectLayout projects={projects} currentProject={currentProject}>
      {encryptionKeys.personal.privateKey.length === 0 ? (
        <EncryptionSetup
          user={user}
          project={currentProject}
          encryptionKeys={encryptionKeys}
          setEncryptionKeys={setEncryptionKeys}
        />
      ) : (
        <>
          <div className="w-full">
            <div className="flex w-full items-center justify-between">
              <BranchDropdown
                branches={branches}
                setBranches={setBranches}
                selectedBranch={selectedBranch}
                setSelectedBranch={setSelectedBranch}
              />

              <Button
                onClick={() => setIsOpen(true)}
                className="border border-white focus:outline-none"
              >
                <GitBranchPlus className="mr-3 h-4 w-4" />
                <span className="hidden sm:block">Create new branch</span>
                <span className="block sm:hidden">Branch</span>
              </Button>
            </div>
          </div>

          <EnvironmentVariableEditor />

          <CreateBranchModal
            onSuccessCreation={() => {}}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </>
      )}
    </ProjectLayout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSideSession(context);
  const user = session?.user;

  // @ts-ignore
  const { slug } = context.params;

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
          slug: true,
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
  const currentProject = projects.find((project) => project.slug === slug);

  if (!currentProject) {
    return {
      redirect: {
        destination: "/projects",
        permanent: false,
      },
    };
  }

  const publicKey = await prisma.publicKey.findFirst({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      key: true,
    },
  });

  const encryptedProjectKey = await prisma.encryptedProjectKey.findFirst({
    where: { projectId: currentProject.id },
    select: {
      encryptedKey: true,
    },
  });

  return {
    props: {
      user,
      currentProject: JSON.parse(JSON.stringify(currentProject)),
      projects: JSON.parse(JSON.stringify(projects)),
      publicKey: publicKey?.key || "",
      encryptedProjectKey,
    },
  };
}

export default ProjectPage;
