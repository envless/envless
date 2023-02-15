import { type GetServerSidePropsContext } from "next";
import { useState } from "react";
import ProjectLayout from "@/layouts/Project";
import { getServerSideSession } from "@/utils/session";
import { Project } from "@prisma/client";
import { GitBranchPlus, TerminalSquare } from "lucide-react";
import { BranchPopover } from "@/components/branches/BranchPopover";
import CreateBranchModal from "@/components/branches/CreateBranchModal";
import { EnvironmentVariableEditor } from "@/components/projects/EnvironmentVariableEditor";
import { Button } from "@/components/theme";
import prisma from "@/lib/prisma";

/**
 * A functional component that represents a project.
 * @param {Props} props - The props for the component.
 * @param {Projects} props.projects - The projects the user has access to.
 * @param {currentProject} props.currentProject - The current project.
 */

interface Props {
  projects: Project[];
  currentProject: Project;
}

export const ProjectPage = ({ projects, currentProject }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const defaultBranches = [
    { id: 1, name: "main", isSelected: true },
    { id: 2, name: "staging", isSelected: false },
    { id: 3, name: "production", isSelected: false },
    { id: 4, name: "feat/upload-env-file", isSelected: false },
  ];
  const [seletedBranch, setSelectedBranch] = useState(defaultBranches[0]);
  const [branches, setBranches] = useState(defaultBranches);

  return (
    <ProjectLayout projects={projects} currentProject={currentProject}>
      <CreateBranchModal isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="w-full rounded bg-dark px-5 py-6">
        <div className="flex flex-col md:flex-row md:space-x-1">
          <TerminalSquare className="h-8 w-8 shrink-0 text-teal-300" />
          <div className="mt-2 px-0 md:mt-0 md:px-4">
            <h3 className="text-sm leading-relaxed text-white">
              This project does not have a production branch
            </h3>
            <p className="mt-1 text-sm font-light text-gray-500">
              Production branches are protected. You cannot update it directly
              without making a pull request.You can unprotect production
              branches by going to settings page.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 w-full">
        <div className="flex w-full items-center justify-between">
          <BranchPopover
            branches={branches}
            selectedBranch={seletedBranch}
            setSelectedBranch={setSelectedBranch}
            setBranches={setBranches}
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
    </ProjectLayout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSideSession(context);
  const user = session?.user;

  // @ts-ignore
  const { id } = context.params;

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
  const currentProject = projects.find((project) => project.id === id);

  if (!currentProject) {
    return {
      redirect: {
        destination: "/projects",
        permanent: false,
      },
    };
  }

  return {
    props: {
      currentProject: JSON.parse(JSON.stringify(currentProject)),
      projects: JSON.parse(JSON.stringify(projects)),
    },
  };
}

export default ProjectPage;
