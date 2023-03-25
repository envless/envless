import { useEffect, useState } from "react";
import ProjectLayout from "@/layouts/Project";
import { withAccessControl } from "@/utils/withAccessControl";
import { Project, UserRole } from "@prisma/client";
import { EncryptedProjectKey, PublicKey } from "@prisma/client";
import { GitBranchPlus } from "lucide-react";
import BranchDropdown from "@/components/branches/BranchDropdown";
import CreateBranchModal from "@/components/branches/CreateBranchModal";
import EncryptionSetup from "@/components/projects/EncryptionSetup";
import { EnvironmentVariableEditor } from "@/components/projects/EnvironmentVariableEditor";
import { Button } from "@/components/theme";
import OpenPGP from "@/lib/encryption/openpgp";

/**
 * A functional component that represents a project.
 * @param {Props} props - The props for the component.
 * @param {Projects} props.projects - The projects the user has access to.
 * @param {currentProject} props.currentProject - The current project.
 * @param {roleInProject} props.roleInProject - The user role in current project.
 */
interface Props {
  user: object;
  projects: Project[];
  currentProject: Project;
  roleInProject: UserRole;
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

const defaultBranches = [
  { id: 1, name: "main", isSelected: true },
  { id: 2, name: "staging", isSelected: false },
  { id: 3, name: "production", isSelected: false },
  { id: 4, name: "feat/upload-env-file", isSelected: false },
];

export const ProjectPage = ({
  user,
  projects,
  currentProject,
  roleInProject,
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

  const [selectedBranch, setSelectedBranch] = useState(defaultBranches[0]);

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
  }, [encryptionKeys]);

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
  }, [encryptionKeys.personal, encryptionKeys.project]);

  return (
    <ProjectLayout
      projects={projects}
      currentProject={currentProject}
      currentRole={roleInProject}
    >
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
                label="Current Branch"
                dropdownLabel="Switch between branches"
                branches={defaultBranches}
                selectedBranch={selectedBranch}
                onClick={(branches) => setSelectedBranch(branches)}
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

export const getServerSideProps = withAccessControl({
  withEncryptedProjectKey: true,
  hasAccess: {
    owner: true,
    maintainer: true,
    developer: true,
    guest: true,
  },
});

export default ProjectPage;
