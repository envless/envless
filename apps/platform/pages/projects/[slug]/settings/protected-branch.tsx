import ProjectLayout from "@/layouts/Project";
import { withAccessControl } from "@/utils/withAccessControl";
import type { Project, UserRole } from "@prisma/client";
import ProjectSettings from "@/components/projects/ProjectSettings";

/**
 * A functional component that represents a project.
 * @param {SettingProps} props - The props for the component.
 * @param {Projects} props.projects - The projects the user has access to.
 * @param {currentProject} props.currentProject - The current project.
 * @param {roleInProject} props.roleInProject - The user role in current project.
 */

interface ProtectedBranchPageProps {
  projects: Project[];
  currentProject: Project;
  roleInProject: UserRole;
}

export const ProtectedBranch = ({
  projects,
  currentProject,
  roleInProject,
}: ProtectedBranchPageProps) => {
  const props = {
    projects,
    currentProject,
    roleInCurrentProject: roleInProject,
  };

  return (
    <ProjectLayout tab="settings" {...props}>
      <ProjectSettings active="branches" {...props}>
        {/* UI here */}
      </ProjectSettings>
    </ProjectLayout>
  );
};

export const getServerSideProps = withAccessControl({
  hasAccess: { maintainer: true, owner: true },
});

export default ProtectedBranch;
