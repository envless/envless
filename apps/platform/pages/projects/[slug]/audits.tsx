import ProjectLayout from "@/layouts/Project";
import { withAccessControl } from "@/utils/withAccessControl";
import { Project, UserRole } from "@prisma/client";

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
}

export const AuditLogsPage = ({
  projects,
  currentProject,
  currentRole,
}: Props) => {
  return (
    <ProjectLayout
      tab="audits"
      projects={projects}
      currentRole={currentRole}
      currentProject={currentProject}
    >
      <h1>AuditLogsPage for {currentProject.name}</h1>
    </ProjectLayout>
  );
};

export const getServerSideProps = withAccessControl({
  hasAccess: { maintainer: true, developer: true, guest: true, owner: true },
});

export default AuditLogsPage;
