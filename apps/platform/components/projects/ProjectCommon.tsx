import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useMemo, useState } from "react";
import ProjectLayout from "@/layouts/Project";
import { useBranchesStore } from "@/store/Branches";
import type { Branch, Project, User, UserRole } from "@prisma/client";
import { GitBranch, GitBranchPlus } from "lucide-react";
import { NextSeo } from "next-seo";
import BranchDropdown from "../branches/BranchDropdown";
import CreateBranchModal from "../branches/CreateBranchModal";
import { Button } from "../theme";
import { EnvironmentVariableEditor } from "./EnvironmentVariableEditor";

interface Props {
  user: User;
  projects: Project[];
  currentProject: Project;
  currentRole: UserRole;
  branches: Branch[];
  currentBranch: Branch;
}

export const ProjectCommon = ({
  user,
  projects,
  currentProject,
  currentRole,
  branches,
  currentBranch,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { setBranches } = useBranchesStore();
  const router = useRouter();

  useEffect(() => {
    setBranches(branches);
  }, [branches, setBranches]);

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
            router.push(`/projects/${currentProject.slug}/tree/${branch.name}`);
          }}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </Fragment>
    </ProjectLayout>
  );
};
