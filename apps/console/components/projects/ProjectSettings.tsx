import React from "react";
import { getProjectSettingTabs } from "@/utils/helpers";
import type { Project, UserRole } from "@prisma/client";
import Tabs from "@/components/settings/Tabs";

type ActiveType = "general" | "branches" | "danger";

interface SettingsProps {
  projects: Project[];
  currentProject: Project;
  currentRole: UserRole;
  active: ActiveType;
  children?: React.ReactNode;
}

const ProjectSettings = ({
  projects,
  currentProject,
  currentRole,
  active,
  children,
}: SettingsProps) => {
  const tabData = React.useMemo(
    () => getProjectSettingTabs(currentRole, currentProject.slug),
    [currentProject.slug, currentRole],
  );

  return (
    <>
      <div className="mb-4 w-full px-4 md:mb-0 md:w-1/2 lg:w-1/3">
        <Tabs active={active} options={tabData} />
      </div>

      <div className="mb-4 w-full px-4 md:mb-0 md:w-1/2 lg:w-2/3">
        {children}
      </div>
    </>
  );
};

export default ProjectSettings;
