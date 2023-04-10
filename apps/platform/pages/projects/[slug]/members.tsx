import { type GetServerSidePropsContext } from "next";
import { useState } from "react";
import ProjectLayout from "@/layouts/Project";
import Member from "@/models/member";
import type { MemberType, UserType } from "@/types/resources";
import { getServerSideSession } from "@/utils/session";
import { withAccessControl } from "@/utils/withAccessControl";
import { MembershipStatus, Project, UserRole } from "@prisma/client";
import AddMemberModal from "@/components/members/AddMemberModal";
import MembersTable from "@/components/members/Table";
import prisma from "@/lib/prisma";

interface Props {
  projects: Project[];
  currentProject: Project;
  currentRole: UserRole;
  members: UserType[];
  user: UserType;
  activeMembers: MemberType[];
  inactiveMembers: MemberType[];
  pendingMembers: MemberType[];
}

export const MembersPage = ({
  projects,
  currentProject,
  currentRole,
  user,
  activeMembers,
  pendingMembers,
  inactiveMembers,
}: Props) => {
  const [tab, setTab] = useState("active");

  return (
    <ProjectLayout
      tab="members"
      projects={projects}
      currentProject={currentProject}
      currentRole={currentRole}
    >
      <div className="w-full">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-6">
            <h1 className="text-lg">Team members</h1>
          </div>

          <div className="col-span-6">
            <AddMemberModal projectId={currentProject.id} />
          </div>
        </div>

        <div className="mt-3 flex flex-col">
          <div className="inline-block min-w-full py-4 align-middle">
            <div className="ring-darker shadow ring-1 ring-opacity-5 md:rounded">
              {tab === "active" && (
                <MembersTable
                  members={activeMembers}
                  tab={tab}
                  setTab={setTab}
                  currentRole={currentRole}
                  projectId={currentProject.id}
                  user={user}
                />
              )}

              {tab === "pending" && (
                <MembersTable
                  members={pendingMembers}
                  tab={tab}
                  setTab={setTab}
                  currentRole={currentRole}
                  projectId={currentProject.id}
                  user={user}
                />
              )}

              {tab === "inactive" && (
                <MembersTable
                  members={inactiveMembers}
                  tab={tab}
                  setTab={setTab}
                  currentRole={currentRole}
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

const getPageServerSideProps = async (context: GetServerSidePropsContext) => {
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

  const activeMembers = await Member.getMany(currentProject.id);
  const inactiveMembers = await Member.getMany(
    currentProject.id,
    MembershipStatus.inactive,
  );
  const pendingMembers = await Member.getMany(
    currentProject.id,
    MembershipStatus.pending,
  );

  return {
    props: {
      activeMembers: JSON.parse(JSON.stringify(activeMembers)),
      inactiveMembers: JSON.parse(JSON.stringify(inactiveMembers)),
      pendingMembers: JSON.parse(JSON.stringify(pendingMembers)),
    },
  };
};

export const getServerSideProps = withAccessControl({
  getServerSideProps: getPageServerSideProps,
  hasAccess: { owner: true, maintainer: true },
});

export default MembersPage;
