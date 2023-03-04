import { type GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import ProjectLayout from "@/layouts/Project";
import Member from "@/models/member";
import { UserType } from "@/types/resources";
import { getServerSideSession } from "@/utils/session";
import { trpc } from "@/utils/trpc";
import { Project } from "@prisma/client";
import clsx from "clsx";
import { Lock, Settings2, Unlock, UserPlus } from "lucide-react";
import AddMemberModal from "@/components/members/AddMemberModal";
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
  members: UserType[];
  user: UserType;
}

export const MembersPage = ({
  members,
  projects,
  currentProject,
  user,
}: Props) => {
  const [tab, setTab] = useState("active");
  const [team, setTeam] = useState<UserType[]>(members);

  useEffect(() => {
    console.log("Setting up the team based on tab state");
  }, [tab]);

  return (
    <ProjectLayout
      tab="members"
      projects={projects}
      currentProject={currentProject}
    >
      <div className="w-full">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-6">
            <h1 className="text-lg">Team members</h1>
          </div>

          <div className="col-span-6">
            <AddMemberModal projectId={currentProject.id} user={user} />
          </div>
        </div>

        <div className="mt-3 flex flex-col">
          <div className="inline-block min-w-full py-4 align-middle">
            <div className="overflow-hidden shadow ring-1 ring-darker ring-opacity-5 md:rounded">
              <div className="min-w-full rounded-t bg-darker p-5">
                <nav className="flex" aria-label="Tabs">
                  <button
                    onClick={() => setTab("active")}
                    className={clsx(
                      "rounded-md px-3 py-1 text-sm font-medium",
                      tab === "active"
                        ? "bg-dark text-teal-300"
                        : "text-light hover:text-lighter",
                    )}
                  >
                    Active
                  </button>

                  <button
                    onClick={() => setTab("pending")}
                    className={clsx(
                      "rounded-md px-3 py-1 text-sm font-medium",
                      tab === "pending"
                        ? "bg-dark text-teal-300"
                        : "text-light hover:text-lighter",
                    )}
                  >
                    Pending
                  </button>

                  <button
                    onClick={() => setTab("inactive")}
                    className={clsx(
                      "rounded-md px-3 py-1 text-sm font-medium",
                      tab === "inactive"
                        ? "bg-dark text-teal-300"
                        : "text-light hover:text-lighter",
                    )}
                  >
                    Inactive
                  </button>

                  <div className="flex-1">
                    <input
                      type="text"
                      className="input-primary float-right max-w-md justify-end py-1.5 text-sm"
                      placeholder="Search members..."
                    />
                  </div>
                </nav>
              </div>

              <table className="min-w-full divide-y divide-dark">
                <tbody className=" bg-dark">
                  {team.map((member) => (
                    <tr key={member.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={member.image}
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium ">{member.name}</div>
                            <div className="text-light">{member.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="mt-3 py-4 pl-3 pr-4 text-sm font-medium sm:pr-6">
                        {member.role}
                      </td>

                      <td className="mt-3 hidden py-4 pl-3 pr-4 text-sm font-medium sm:pr-6 md:block">
                        <div className="inline-flex">
                          2FA
                          {member.twoFactorEnabled ? (
                            <Lock className="ml-2 h-4 w-4 text-teal-400" />
                          ) : (
                            <Unlock className="ml-2 h-4 w-4 text-red-400" />
                          )}
                        </div>
                      </td>

                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a href="#" className="hover:text-teal-400">
                          <Settings2 className="h-5 w-5" strokeWidth={2} />
                          <span className="sr-only">, {member.name}</span>
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

  const members = await Member.getMany(currentProject.id);

  return {
    props: {
      currentProject: JSON.parse(JSON.stringify(currentProject)),
      projects: JSON.parse(JSON.stringify(projects)),
      user: user,
      members,
    },
  };
}

export default MembersPage;
