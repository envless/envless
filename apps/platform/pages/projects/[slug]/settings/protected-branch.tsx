import ProjectLayout from "@/layouts/Project";
import { withAccessControl } from "@/utils/withAccessControl";
import { Project } from "@prisma/client";
import ProjectSettings from "@/components/projects/ProjectSettings";

/**
 * A functional component that represents a project.
 * @param {SettingProps} props - The props for the component.
 * @param {Projects} props.projects - The projects the user has access to.
 * @param {currentProject} props.currentProject - The current project.
 */

interface ProtectedBranchPageProps {
  projects: Project[];
  currentProject: Project;
  projectRole: string;
}

export const ProtectedBranch = ({
  projects,
  currentProject,
  projectRole,
}: ProtectedBranchPageProps) => {
  const props = { projects, currentProject, roleInCurrentProject: projectRole };

  return (
    <ProjectLayout tab="settings" {...props}>
      <ProjectSettings active="branches" {...props}>
        {/* UI here */}
      </ProjectSettings>
    </ProjectLayout>
  );
};

export const getServerSideProps = withAccessControl({});

export default ProtectedBranch;
