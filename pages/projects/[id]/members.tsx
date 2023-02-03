import { type GetServerSidePropsContext } from "next";
import ProjectLayout from "@/layouts/Project";
import { getServerSideSession } from "@/utils/session";
import { Project } from "@prisma/client";
import { MoreVertical, UserPlus } from "lucide-react";
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

export const MembersPage = ({ projects, currentProject }: Props) => {
  const members = [
    {
      name: "Lindsay Walton",
      title: "Front-end Developer",
      department: "Optimization",
      email: "lindsay.walton@example.com",
      role: "Member",
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },

    {
      name: "Lindsay Walton",
      title: "Front-end Developer",
      department: "Optimization",
      email: "lindsay.walton@example.com",
      role: "Member",
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  ];

  return (
    <ProjectLayout
      tab="members"
      projects={projects}
      currentProject={currentProject}
    >
      <div className="w-full">
        <div className="grid gap-2 md:grid-cols-12">
          <div className="md:col-span-5">
            <h1 className="mb-5 text-lg">Team members</h1>
          </div>

          <div className="md:col-span-7">
            <div className="grid grid-cols-12 gap-2">
              <input
                type="text"
                className="input-primary col-span-7 w-full py-1 text-sm md:col-span-8"
                placeholder="Search..."
              />

              <div className="col-span-5 md:col-span-4">
                <Button
                  full
                  className="float-right md:col-span-1"
                  onClick={() => console.log("Invite")}
                >
                  <UserPlus className="mr-2 h-4 w-4 " strokeWidth={2} />
                  Add a member
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-col">
          <div className="inline-block min-w-full py-4 align-middle">
            <div className="overflow-hidden shadow ring-1 ring-darker ring-opacity-5 md:rounded">
              <table className="min-w-full divide-y divide-dark">
                <thead className="bg-darker">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold  sm:pl-6"
                    >
                      Member
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold "
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="hidden px-3 py-3.5 text-left text-sm font-semibold md:block "
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>

                <tbody className=" bg-dark">
                  {members.map((member) => (
                    <tr key={member.email}>
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
                            <div className="">{member.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-3 py-4 text-sm ">
                        <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="relative mt-3 hidden whitespace-nowrap py-4 pl-3 pr-4 text-sm font-medium sm:pr-6 md:block">
                        {member.role}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a href="#" className="hover:text-teal-400">
                          <MoreVertical className="h-5 w-5" strokeWidth={2} />
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

  return {
    props: {
      currentProject: JSON.parse(JSON.stringify(currentProject)),
      projects: JSON.parse(JSON.stringify(projects)),
    },
  };
}

export default MembersPage;
