import { type GetServerSidePropsContext } from "next";
import ProjectLayout from "@/layouts/Project";
import { getServerSideSession } from "@/utils/session";
import { Project } from "@prisma/client";
import prisma from "@/lib/prisma";
import { HiOutlineCommandLine, HiCloudArrowUp } from "react-icons/hi2";
import { TbDragDrop } from "react-icons/tb";
import { Button } from "@/components/theme";
import Link from "next/link";

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
  return (
    <ProjectLayout projects={projects} currentProject={currentProject}>

      <div className="px-5 py-6 bg-white bg-opacity-10 w-full">
        <div className="flex flex-col md:flex-row md:space-x-1">
          <HiOutlineCommandLine className="h-8 w-8 text-teal-300 shrink-0" />
          <div className="px-0 md:px-4 mt-2 md:mt-0">
            <h3 className="text-sm text-white leading-relaxed">This project does not have a production branch defined</h3>
            <p className="text-gray-500 mt-1 text-sm font-light">Production branches are protected. You cannot update it directly without making a pull request.You can unprotect production branches by going to settings page.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 w-full">
        <div className="w-full flex items-center justify-between">
          <Button outline small>main</Button>
          <Button outline small className="border border-white focus:outline-none">New Branch</Button>
        </div>
      </div>

      <div className="w-full mt-4 px-8 py-20 border-2 border-darker">
          <div className="flex flex-col items-center">
            <TbDragDrop className="w-10 h-10" />
            <div className="max-w-md mx-auto text-center">
            <h2 className="text-xl font-light mt-4">Drag and drop .env files</h2>
            <p className="text-xs mt-1 text-gray-200">You can also click here to import, copy/paste contents in .env file, or create <Link href="/" className="text-teal-300">one at a time.</Link></p>
            </div>
          </div>
      </div>
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
