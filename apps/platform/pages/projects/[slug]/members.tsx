import { type GetServerSidePropsContext } from "next";
import { useMemo, useState } from "react";
import ProjectLayout from "@/layouts/Project";
import Member from "@/models/member";
import type { MemberType, UserType } from "@/types/resources";
import type { MemberType, UserType } from "@/types/resources";
import { getServerSideSession } from "@/utils/session";
import { trpc } from "@/utils/trpc";
import { withAccessControl } from "@/utils/withAccessControl";
import { Project, UserRole } from "@prisma/client";
import { PaginationState } from "@tanstack/react-table";
import MembersTableContainer from "@/components/members/MembersTableContainer";
import { QUERY_ITEMS_PER_PAGE } from "@/lib/constants";
import prisma from "@/lib/prisma";

interface Props {
  projects: Project[];
  currentProject: Project;
  currentRole: UserRole;
  user: UserType;
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
        <div className="mt-3 flex flex-col">
          <div className="inline-block min-w-full py-4 align-middle">
            <div className="ring-darker shadow ring-1 ring-opacity-5 md:rounded">
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
  hasAccess: { owner: true, maintainer: true },
});

export default MembersPage;
