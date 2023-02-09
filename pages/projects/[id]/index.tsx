import { type GetServerSidePropsContext } from "next";
import ProjectLayout from "@/layouts/Project";
import { getServerSideSession } from "@/utils/session";
import { Project } from "@prisma/client";
import {
  ChevronDown,
  GitBranchIcon,
  Search,
  TerminalSquareIcon,
} from "lucide-react";
import { EnvironmentVariableEditor } from "@/components/projects/EnvironmentVariableEditor";
import { Button, Hr, Popover } from "@/components/theme";
import prisma from "@/lib/prisma";
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
      <div className="w-full bg-white bg-opacity-10 px-5 py-6">
        <div className="flex flex-col md:flex-row md:space-x-1">
          <TerminalSquareIcon className="h-8 w-8 shrink-0 text-teal-300" />
          <div className="mt-2 px-0 md:mt-0 md:px-4">
            <h3 className="text-sm leading-relaxed text-white">
              This project does not have a production branch defined
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
          <Popover
            button={
              <button className="inline-flex items-center justify-center space-x-2 rounded border border-dark px-3 py-1.5 text-xs transition-colors duration-75 hover:bg-dark">
                <div>
                  <GitBranchIcon className="h-4 w-4" />
                </div>

                <span className="font-semibold">main</span>

                <div>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </button>
            }
          >
            <div className="text-xs">
              <div className="border-b border-dark px-3 py-2">
                <p className="font-semibold">Switch branches</p>
              </div>

              <div className="relative mt-1 flex items-center border-b border-dark px-3">
                <Search className="absolute h-4 w-4 text-light" />
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="border-none bg-transparent w-full pr-3 pl-6 text-xs focus:outline-none focus:ring-0"
                  placeholder="Find a branch..."
                />
                <Hr />
              </div>

              <div className="text-xs px-6 py-2">
                 <ul className="w-full flex flex-col gap-2">
                   <Link href="#">
                    <li className="w-full inline-flex items-center justify-between">
                      <span>main</span>
                      <span className="px-1 py-0.5 rounded-full border border-dark text-teal-300">default</span>
                    </li>
                   </Link>

                   <Link href="#">
                    <li>staging</li>
                   </Link>

                   <Link href="#">
                    <li>production</li>
                   </Link>
                 </ul>
              </div>
            </div>
          </Popover>

          <Button
            outline
            small
            className="border border-white focus:outline-none"
          >
            New Branch
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
