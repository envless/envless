import { useRouter } from "next/router";
import { Fragment, useEffect, useMemo, useState } from "react";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import ProjectLayout from "@/layouts/Project";
import { useBranchesStore } from "@/store/Branches";
import { Branch, EncryptedProjectKey, UserPublicKey } from "@prisma/client";
import { GitBranch, GitBranchPlus, Link } from "lucide-react";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import OpenPGP from "@/lib/encryption/openpgp";
import BranchDropdown from "../branches/BranchDropdown";
import CreateBranchModal from "../branches/CreateBranchModal";
import { Button } from "../theme";
import EncryptionSetup from "./EncryptionSetup";
import { EnvironmentVariableEditor } from "./EnvironmentVariableEditor";

interface PersonalKey {
  publicKey: UserPublicKey["key"];
  privateKey: string;
}

interface EncryptionKeys {
  personal: PersonalKey;
  project: ProjectKey;
}

interface ProjectKey {
  decryptedProjectKey: string;
  encryptedProjectKey: EncryptedProjectKey["encryptedKey"];
}

interface Props {
  user: any;
  projects: any;
  currentProject: any;
  currentRole: any;
  publicKey: string;
  encryptedProjectKey: { encryptedKey: string } | null;
  branches: Branch[];
  privateKey: string;
  currentBranch: Branch;
}

export const ProjectCommon = ({
  user,
  projects,
  currentProject,
  currentRole,
  publicKey,
  encryptedProjectKey,
  branches,
  privateKey,
  currentBranch,
}: Props) => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const [encryptionKeys, setEncryptionKeys] = useState<EncryptionKeys>({
    personal: {
      publicKey: publicKey,
      privateKey: privateKey || "",
    },
    project: {
      decryptedProjectKey: "",
      encryptedProjectKey: encryptedProjectKey?.encryptedKey || "",
    },
  });

  const { setBranches } = useBranchesStore();
  const router = useRouter();

  useEffect(() => {
    setBranches(branches);
  }, [branches, setBranches]);

  useUpdateEffect(() => {
    const sessionUser = session?.user as any;
    const getPrivateKey = sessionUser?.privateKey as string;

    if (getPrivateKey) {
      setEncryptionKeys((prev) => ({
        ...prev,
        personal: {
          ...prev.personal,
          privateKey: getPrivateKey,
        },
      }));
    }
  }, [encryptionKeys.personal.publicKey]);

  useUpdateEffect(() => {
    (async () => {
      let privateKey = encryptionKeys.personal.privateKey;

      if (!privateKey) {
        const sessionUser = session?.user as any;
        privateKey = sessionUser?.privateKey as string;
      }

      const encryptedProjectKey = encryptionKeys.project.encryptedProjectKey;

      if (privateKey) {
        const decryptedProjectKey = (await OpenPGP.decrypt(
          encryptedProjectKey,
          privateKey,
        )) as string;

        setEncryptionKeys({
          personal: {
            ...encryptionKeys.personal,
            privateKey: privateKey,
          },
          project: {
            ...encryptionKeys.project,
            decryptedProjectKey: decryptedProjectKey,
          },
        });
      }
    })();
  }, [encryptionKeys.project.encryptedProjectKey]);

  useEffect(() => {
    setBranches(branches);
  }, [branches, setBranches]);

  return (
    <ProjectLayout
      projects={projects}
      currentProject={currentProject}
      currentRole={currentRole}
    >
      <NextSeo title={`${currentProject.name} - Envless project setup`} />

      {encryptionKeys.personal.privateKey.length === 0 ? (
        <EncryptionSetup
          user={user}
          project={currentProject}
          encryptionKeys={encryptionKeys}
          setEncryptionKeys={setEncryptionKeys}
        />
      ) : (
        <Fragment>
          <div className="w-full">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center justify-center gap-4">
                <BranchDropdown
                  label="Current Branch"
                  dropdownLabel="Switch between branches"
                  branches={branches}
                  selectedBranch={currentBranch}
                  currentProjectSlug={currentProject.slug}
                />

                <Link
                  className="group flex items-center text-sm transition-colors"
                  href={`/projects/${currentProject.slug}/branches`}
                >
                  <GitBranch className="text-lighter mr-1 h-4 w-4 group-hover:text-teal-400" />
                  <span className="text-light group-hover:text-teal-400">
                    {branches.length}{" "}
                    {branches.length === 1 ? "branch" : "branches"}
                  </span>
                </Link>
              </div>

              <Button
                onClick={() => setIsOpen(true)}
                leftIcon={<GitBranchPlus className="mr-3 h-4 w-4" />}
              >
                Create new branch
              </Button>
            </div>
          </div>

          <EnvironmentVariableEditor branchId={currentBranch.id} />

          <CreateBranchModal
            onSuccessCreation={(branch: Branch) => {
              router.push(
                `/projects/${currentProject.slug}/tree/${branch.name}`,
              );
            }}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </Fragment>
      )}
    </ProjectLayout>
  );
};
