import { type GetServerSidePropsContext } from "next";
import Link from "next/link";
import ProjectLayout from "@/layouts/Project";
import { getServerSideSession } from "@/utils/session";
import { Project } from "@prisma/client";
import {
  Check,
  ChevronDown,
  GitBranchIcon,
  GitBranchPlus,
  Search,
  TerminalSquareIcon,
} from "lucide-react";
import { EnvironmentVariableEditor } from "@/components/projects/EnvironmentVariableEditor";
import { Button, Hr, Popover } from "@/components/theme";
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
            zIndex={10}
            button={
              <button className="inline-flex items-center justify-center space-x-3 rounded border border-dark bg-dark px-3 py-2 text-sm transition-colors duration-75 hover:bg-darker">
                <div>
                  <GitBranchIcon className="h-4 w-4" />
                </div>

                <span>
                  <span className="mr-3 text-xs text-light">
                    Current branch
                  </span>
                  <span className="font-semibold">main</span>
                </span>

                <div>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </button>
            }
          >
            <div className="text-xs">
              <div className="border-b border-dark px-3 py-3">
                <p className="font-semibold">Switch between branches</p>
              </div>

              <div className="relative mt-1 flex items-center border-b border-dark px-3">
                <Search className="absolute mb-1.5 h-4 w-4 text-light" />
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="w-full border-none bg-transparent pr-3 pl-6 pb-3 text-sm focus:outline-none focus:ring-0"
                  placeholder="Find a branch..."
                />
                <Hr />
              </div>

              <div className="text-sm">
                <ul className="flex w-full flex-col">
                  <Link href="#">
                    <li className="inline-flex w-full items-center justify-between px-3 py-2 hover:bg-dark">
                      <span>main</span>
                      <Check
                        className="h-4 w-4 text-teal-300"
                        aria-hidden="true"
                      />
                    </li>
                  </Link>

                  <Link href="#">
                    <li className="inline-flex w-full items-center justify-between px-3 py-2 hover:bg-dark">
                      staging
                    </li>
                  </Link>

                  <Link href="#">
                    <li className="inline-flex w-full items-center justify-between px-3 py-2 hover:bg-dark">
                      production
                    </li>
                  </Link>
                </ul>
              </div>
            </div>
          </Popover>

          <Button className="border border-white focus:outline-none">
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
