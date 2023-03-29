import { GetServerSidePropsContext } from "next";
import { useState } from "react";
import ProjectLayout from "@/layouts/Project";
import { trpc } from "@/utils/trpc";
import { withAccessControl } from "@/utils/withAccessControl";
import { Project, UserRole } from "@prisma/client";
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
}

export const AuditLogsPage = ({
  projects,
  currentProject,
  currentRole,
  initialAuditLogs,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });

  const { data: auditLogs } = trpc.auditLogs.getAll.useQuery(
    {
      page: pagination.pageIndex,
    },
    {
      initialData: initialAuditLogs,
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  return (
    <ProjectLayout
      tab="audits"
      projects={projects}
      currentRole={currentRole}
      currentProject={currentProject}
    >
      <AuditLogSideOver open={open} setOpen={setOpen} auditLogs={auditLogs} />
      <AuditLogTable
        pagination={pagination}
        setPagination={setPagination}
        auditLogs={auditLogs}
        setSlideOverOpen={setOpen}
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
    take: 10,
  });

  return {
    props: {
      initialAuditLogs: JSON.parse(JSON.stringify(auditLogs)),
    },
  };
};

export const getServerSideProps = withAccessControl({
  hasAccess: { maintainer: true, developer: true, guest: true, owner: true },
  getServerSideProps: _getServerSideProps,
});

export default AuditLogsPage;
