import { type GetServerSidePropsContext } from "next";
import { useMemo, useState } from "react";
import ProjectLayout from "@/layouts/Project";
import Member from "@/models/member";
import type { MemberType, SessionUserType } from "@/types/resources";
import { getServerSideSession } from "@/utils/session";
import { trpc } from "@/utils/trpc";
import { withAccessControl } from "@/utils/withAccessControl";
import { MembershipStatus, Project, UserRole } from "@prisma/client";
import { PaginationState } from "@tanstack/react-table";
import AddMemberModal from "@/components/members/AddMemberModal";
import MembersTableContainer from "@/components/members/MembersTableContainer";
import { QUERY_ITEMS_PER_PAGE } from "@/lib/constants";
import prisma from "@/lib/prisma";

interface Props {
  projects: Project[];
  currentProject: Project;
  currentRole: UserRole;
  user: SessionUserType;
  initialMembers: MemberType[];
  totalMembers: number;
}

export const MembersPage = ({
  projects,
  currentProject,
  currentRole,
  user,
  totalMembers,
  initialMembers,
}: Props) => {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: QUERY_ITEMS_PER_PAGE,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const pageCount = Math.ceil(totalMembers / pagination.pageSize);

  const { data: members, refetch } = trpc.members.getAll.useQuery(
    {
      page: pagination.pageIndex + 1,
      projectId: currentProject.id,
    },
    {
      initialData: initialMembers,
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  const memoizedMembers = useMemo(() => members, [members]);

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
            <AddMemberModal
              projectId={currentProject.id}
              triggerRefetchMembers={refetch}
            />
          </div>
        </div>
        <MembersTableContainer
          members={memoizedMembers}
          currentRole={currentRole}
          projectId={currentProject.id}
          user={user}
          totalMembers={totalMembers}
          pageCount={pageCount}
          pagination={pagination}
          setPagination={setPagination}
          refetchMembersAfterUpdate={refetch}
        />
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
        destination: "/login",
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

  const membersInProject = await Member.getMany(currentProject.id);
  const totalMembers = await prisma.access.count({
    where: { projectId: currentProject.id },
  });

  return {
    props: {
      initialMembers: JSON.parse(JSON.stringify(membersInProject)),
      totalMembers,
    },
  };
};

export const getServerSideProps = withAccessControl({
  getServerSideProps: getPageServerSideProps,
  hasAccess: {
    roles: [UserRole.maintainer, UserRole.owner],
    statuses: [MembershipStatus.active],
  },
});

export default MembersPage;
