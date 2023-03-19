import { type GetServerSidePropsContext } from "next";
import { useState } from "react";
import ProjectLayout from "@/layouts/Project";
import Member from "@/models/member";
import { UserType } from "@/types/resources";
import { getServerSideSession } from "@/utils/session";
import { Access, Project } from "@prisma/client";
import AddMemberModal from "@/components/members/AddMemberModal";
import MembersTable from "@/components/members/Table";
import prisma from "@/lib/prisma";

interface Props {
  projects: Project[];
  currentProject: Project;
  members: UserType[];
  user: UserType;
  userAccessInCurrentProject: Access;
  activeMembers: UserType[];
  inactiveMembers: UserType[];
  pendingMembers: UserType[];
}

export const MembersPage = ({
  projects,
  currentProject,
  user,
  activeMembers,
  pendingMembers,
  inactiveMembers,
  userAccessInCurrentProject,
}: Props) => {
  const [tab, setTab] = useState("active");

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
              {tab === "active" && (
                <MembersTable
                  members={activeMembers}
                  tab={tab}
                  setTab={setTab}
                  userAccessInCurrentProject={userAccessInCurrentProject}
                  projectId={currentProject.id}
                  user={user}
                />
              )}

              {tab === "pending" && (
                <MembersTable
                  members={pendingMembers}
                  tab={tab}
                  setTab={setTab}
                  userAccessInCurrentProject={userAccessInCurrentProject}
                  projectId={currentProject.id}
                  user={user}
                />
              )}

              {tab === "inactive" && (
                <MembersTable
                  members={inactiveMembers}
                  tab={tab}
                  setTab={setTab}
                  userAccessInCurrentProject={userAccessInCurrentProject}
                  projectId={currentProject.id}
                  user={user}
                />
              )}
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
  const { slug } = context.params;

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
          slug: true,
          updatedAt: true,
        },
      },
      role: true,
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
  const currentProject = projects.find((p) => p.slug === slug);

  if (!currentProject) {
    return {
      redirect: {
        destination: "/projects",
        permanent: false,
      },
    };
  }

  const userAccessInCurrentProject = await prisma.access.findUnique({
    where: {
      userId_projectId: {
        userId: user.id,
        projectId: currentProject.id,
      },
    },
  });

  if (!userAccessInCurrentProject) {
    return {
      redirect: {
        destination: "/projects",
        permanent: false,
      },
    };
  }

  const activeMembers = await Member.getMany(currentProject.id);
  const inactiveMembers = await Member.getMany(currentProject.id, false);
  const pendingMembers = await Member.getPending(currentProject.id);

  return {
    props: {
      currentProject: JSON.parse(JSON.stringify(currentProject)),
      projects: JSON.parse(JSON.stringify(projects)),
      userAccessInCurrentProject: JSON.parse(
        JSON.stringify(userAccessInCurrentProject),
      ),
      user,
      activeMembers,
      inactiveMembers,
      pendingMembers,
    },
  };
}

export default MembersPage;
