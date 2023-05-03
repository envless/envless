import { GetServerSidePropsContext } from "next";
import { useMemo, useState } from "react";
import ProjectLayout from "@/layouts/Project";
import { trpc } from "@/utils/trpc";
import { withAccessControl } from "@/utils/withAccessControl";
import { MembershipStatus, Project, UserRole } from "@prisma/client";
import { PaginationState } from "@tanstack/react-table";
import AuditLogSideOver from "@/components/projects/auditLogs/AuditLogSlideOver";
import AuditLogTable from "@/components/projects/auditLogs/AuditLogTable";

/**
 * A functional component that represents a project.
 * @param {Props} props - The props for the component.
 * @param {Projects} props.projects - The projects the user has access to.
 * @param {currentProject} props.currentProject - The current project.
 * @param {currentRole} props.currentRole - The user role in current project.
 */

interface Props {
  projects: Project[];
  currentProject: Project;
  currentRole: UserRole;
  initialAuditLogs: any;
  totalAuditLogs: number;
}

export const AuditLogsPage = ({
  projects,
  currentProject,
  currentRole,
  initialAuditLogs,
  totalAuditLogs,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const pageCount = Math.ceil(totalAuditLogs / pagination.pageSize);

  const { data: auditLogs } = trpc.auditLogs.getAll.useQuery(
    {
      page: pagination.pageIndex + 1,
    },
    {
      initialData: initialAuditLogs,
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  const [auditLogDetail, setAuditLogDetail] = useState();
  const memoizedAuditLogs = useMemo(() => auditLogs, [auditLogs]);

  return (
    <ProjectLayout
      tab="audits"
      projects={projects}
      currentRole={currentRole}
      currentProject={currentProject}
    >
      {auditLogDetail && (
        <AuditLogSideOver
          auditLogDetail={auditLogDetail}
          open={open}
          setOpen={setOpen}
          auditLogs={auditLogs}
        />
      )}
      <AuditLogTable
        pagination={pagination}
        setPagination={setPagination}
        auditLogs={memoizedAuditLogs}
        pageCount={pageCount}
        totalAuditLogs={totalAuditLogs}
        setSlideOverOpen={setOpen}
        setAuditLogDetail={setAuditLogDetail}
      />
    </ProjectLayout>
  );
};

const _getServerSideProps = async (context: GetServerSidePropsContext) => {
  const auditLogs = await prisma?.audit.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      project: {
        select: {
          name: true,
        },
      },
      createdBy: {
        select: {
          name: true,
        },
      },
    },
    take: 25,
  });

  const totalAuditLogs = await prisma?.audit.count();

  return {
    props: {
      initialAuditLogs: JSON.parse(JSON.stringify(auditLogs)),
      totalAuditLogs,
    },
  };
};

export const getServerSideProps = withAccessControl({
  hasAccess: {
    roles: [
      UserRole.maintainer,
      UserRole.developer,
      UserRole.guest,
      UserRole.owner,
    ],
    statuses: [MembershipStatus.active],
  },
  getServerSideProps: _getServerSideProps,
});

export default AuditLogsPage;
