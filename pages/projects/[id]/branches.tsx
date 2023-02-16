import { type GetServerSidePropsContext } from "next";
import { useState } from "react";
import ProjectLayout from "@/layouts/Project";
import { getServerSideSession } from "@/utils/session";
import { Project } from "@prisma/client";
import {
  CheckCheck,
  Copy,
  GitBranch,
  GitBranchPlus,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import Filters from "@/components/branches/Filters";
import { Badge, Button, Label } from "@/components/theme";
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

export const BranchesPage = ({ projects, currentProject }: Props) => {
  const [copied, setCopied] = useState("");

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(value);
    setTimeout(() => setCopied(""), 2000);
  };

  const protectedBranches = [
    {
      id: 1,
      name: "production",
      description: "Used for production environemnts",
      base: "Open",
    },

    {
      id: 2,
      name: "staging",
      description: "Used for staging environemnts",
      base: "Closed",
    },

    {
      id: 3,
      name: "review",
      description: "Used by review apps",
      base: "Merged",
    },

    {
      id: 4,
      name: "public",
      description: "Used by developers and open source contributors",
      base: "Merged",
    },
  ];

  const allBranches = [
    {
      id: 1,
      name: "feat/image-upload",
      description: "Create 2 days ago by John Doe",
      base: "Open",
    },

    {
      id: 2,
      name: "feat/send-transactional-email",
      description: "Create 2 days ago by John Doe",
      base: "Closed",
    },

    {
      id: 3,
      name: "fix/center-the-div",
      description: "Create 2 days ago by John Doe",
      base: "Merged",
    },

    {
      id: 4,
      name: "chore/update-readme",
      description: "Create 2 days ago by John Doe",
      base: "Merged",
    },
  ];

  return (
    <ProjectLayout
      tab="branches"
      projects={projects}
      currentProject={currentProject}
    >
      <div className="w-full">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-6">
            <h1 className="text-lg">Protected branches</h1>
          </div>

          <div className="col-span-6">
            <Button
              className="float-right"
              onClick={() => console.log("Invite")}
            >
              <GitBranchPlus className="mr-2 h-4 w-4 " strokeWidth={2} />
              Protect branches
            </Button>
          </div>
        </div>

        <div className="mt-3 flex flex-col">
          <div className="inline-block min-w-full py-4 align-middle">
            <div className="overflow-hidden shadow ring-1 ring-darker ring-opacity-5 md:rounded">
              <table className="min-w-full divide-y divide-light">
                <tbody className="bg-darker">
                  {protectedBranches.map((pr) => (
                    <tr key={pr.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <Badge type="success">
                              <ShieldCheck
                                className="h-6 w-6"
                                strokeWidth={2}
                              />
                            </Badge>
                          </div>
                          <div className="ml-4">
                            <button
                              onClick={() => {
                                copyToClipboard(pr.name as string);
                              }}
                              className="inline-flex cursor-copy font-medium"
                            >
                              {copied === pr.name ? (
                                <CheckCheck
                                  className="mr-2 h-4 w-4 text-teal-400"
                                  strokeWidth={2}
                                />
                              ) : (
                                <Copy
                                  className="mr-2 h-4 w-4"
                                  strokeWidth={2}
                                />
                              )}

                              {pr.name}
                            </button>
                            <div className="text-light">{pr.description}</div>
                          </div>
                        </div>
                      </td>

                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a href="#" className="float-right hover:text-teal-400">
                          <Settings2 className="h-5 w-5" strokeWidth={2} />
                          <span className="sr-only">, {pr.name}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-12 gap-2">
          <div className="col-span-6">
            <h1 className="text-lg">All branches</h1>
          </div>

          <div className="col-span-6">
            <Button
              className="float-right"
              onClick={() => console.log("Invite")}
            >
              <GitBranchPlus className="mr-2 h-4 w-4 " strokeWidth={2} />
              Create new branch
            </Button>
          </div>
        </div>
        <div className="mt-3 flex flex-col">
          <div className="inline-block min-w-full py-4 align-middle">
            <div className="overflow-hidden shadow ring-1 ring-darker ring-opacity-5 md:rounded">
              <div className="min-w-full rounded-t bg-darker pt-3">
                <Filters />
              </div>
              <table className="min-w-full divide-y divide-light">
                <tbody className="bg-dark">
                  {allBranches.map((pr) => (
                    <tr key={pr.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <Badge type="info">
                              <GitBranch className="h-6 w-6" strokeWidth={2} />
                            </Badge>
                          </div>
                          <div className="ml-4">
                            <button
                              onClick={() => {
                                copyToClipboard(pr.name as string);
                              }}
                              className="inline-flex cursor-copy font-medium"
                            >
                              {copied === pr.name ? (
                                <CheckCheck
                                  className="mr-2 h-4 w-4 text-teal-400"
                                  strokeWidth={2}
                                />
                              ) : (
                                <Copy
                                  className="mr-2 h-4 w-4"
                                  strokeWidth={2}
                                />
                              )}

                              {pr.name}
                            </button>
                            <div className="text-light">{pr.description}</div>
                          </div>
                        </div>
                      </td>

                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Button
                          secondary={true}
                          small
                          className="float-right border-lighter"
                        >
                          Open pull request
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
  const currentProject = projects.find((p) => p.id === id);

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

export default BranchesPage;
