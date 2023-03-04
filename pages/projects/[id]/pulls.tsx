import { type GetServerSidePropsContext } from "next";
import Link from "next/link";
import { ReactNode, useState } from "react";
import ProjectLayout from "@/layouts/Project";
import { getServerSideSession } from "@/utils/session";
import { Project } from "@prisma/client";
import * as HoverCard from "@radix-ui/react-hover-card";
import {
  ArrowLeft,
  GitMerge,
  GitPullRequest,
  GitPullRequestClosed,
  Settings2,
} from "lucide-react";
import CreatePullRequestModal from "@/components/pulls/CreatePullRequestModal";
import Filters from "@/components/pulls/Filters";
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

export const PullRequestPage = ({ projects, currentProject }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const pullRequests = [
    {
      id: 1,
      title: "Add NODE_ENV, REDIS_URL and others",
      subtitle: "#60 opened 2 minutes ago by Lindsay Walton",
      status: "Open",
    },

    {
      id: 2,
      title: "Remove GITHUB_ACCESS_TOKEN",
      subtitle: "#59 closed 1 day ago by John Doe",
      status: "Closed",
    },

    {
      id: 3,
      title: "Rotate ENCRYPTON_KEY",
      subtitle: "#58 merged 2 days ago by Jane Doe",
      status: "Merged",
    },
  ];

  return (
    <ProjectLayout tab="pr" projects={projects} currentProject={currentProject}>
      <CreatePullRequestModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="w-full">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-6">
            <h1 className="text-lg">Pull requests</h1>
          </div>

          <div className="col-span-6">
            <Button className="float-right" onClick={() => setIsOpen(true)}>
              <GitPullRequest className="mr-2 h-4 w-4 " strokeWidth={2} />
              Open pull request
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
                  {pullRequests.map((pr) => (
                    <tr key={pr.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {pr.status === "Open" && (
                              <Badge type="success">
                                <GitPullRequest
                                  className="h-6 w-6"
                                  strokeWidth={2}
                                />
                              </Badge>
                            )}

                            {pr.status === "Closed" && (
                              <Badge type="danger">
                                <GitPullRequestClosed
                                  className="h-6 w-6"
                                  strokeWidth={2}
                                />
                              </Badge>
                            )}

                            {pr.status === "Merged" && (
                              <Badge type="info">
                                <GitMerge className="h-6 w-6" strokeWidth={2} />
                              </Badge>
                            )}
                          </div>
                          <div className="ml-4">
                            <PullRequestHoverCard
                              triggerComponent={
                                <Link href={`#`} className="font-medium">
                                  {pr.title}
                                </Link>
                              }
                            />
                            <div className="text-light">{pr.subtitle}</div>
                          </div>
                        </div>
                      </td>

                      <td className="relative mt-3 hidden whitespace-nowrap py-4 pl-3 pr-4 text-sm font-medium sm:pr-6 md:block">
                        {pr.status === "Open" && (
                          <Label type="success">{pr.status}</Label>
                        )}

                        {pr.status === "Closed" && (
                          <Label type="danger">{pr.status}</Label>
                        )}

                        {pr.status === "Merged" && (
                          <Label type="info">{pr.status}</Label>
                        )}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a href="#" className="hover:text-teal-400">
                          <Settings2 className="h-5 w-5" strokeWidth={2} />
                          <span className="sr-only">, {pr.title}</span>
                        </a>
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

export default PullRequestPage;

interface PullRequestHoverCardProps {
  triggerComponent: ReactNode;
}

function PullRequestHoverCard({ triggerComponent }: PullRequestHoverCardProps) {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger asChild>{triggerComponent}</HoverCard.Trigger>

      <HoverCard.Portal>
        <HoverCard.Content
          className="w-[350px] rounded bg-darker text-xs"
          sideOffset={5}
        >
          <div className="flex w-full flex-col gap-[10px] px-3 py-4">
            <div className="text-light">
              <Link href={"#"} className="underline">
                envless/envless
              </Link>{" "}
              on Feb 22
            </div>

            <div className="flex items-start gap-[10px]">
              <div className="shrink-0">
                <GitPullRequest className="h-4 w-4 text-emerald-200" />
              </div>

              <div className="flex flex-col">
                <p className="text-md font-bold">
                  feat: additional security - ask users to provide OTP for one
                  last time before they disable two factor auth{" "}
                </p>
                <div className="mt-2 inline-flex items-center gap-2">
                  <span className="rounded bg-dark px-1 py-0.5 text-light">
                    envless:main
                  </span>
                  <ArrowLeft className="h-4 w-4 shrink-0 text-lighter" />
                  <span className="rounded bg-dark px-1 py-0.5 text-light">
                    samyogdhital:proj...
                  </span>
                </div>
              </div>
            </div>
          </div>

          <HoverCard.Arrow className="text-dark" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
