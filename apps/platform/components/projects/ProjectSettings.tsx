import React from "react";
import { Project } from "@prisma/client";
import Tabs from "@/components/settings/Tabs";

type ActiveType = "general" | "branches" | "danger";

interface SettingsProps {
  projects: Project[];
  currentProject: Project;
  projectRole: string;
  active: ActiveType;
  children?: React.ReactNode;
}

const ProjectSettings = ({
  projects,
  currentProject,
  projectRole,
  active,
  children,
}: SettingsProps) => {
  const tabData = React.useMemo(
    () => [
      {
        id: "general",
        name: "General settings",
        href: `/projects/${currentProject.slug}/settings`,
      },
      {
        id: "branches",
        name: "Protected branches",
        href: `/projects/${currentProject.slug}/settings/protected-branch`,
      },
      (projectRole === "owner" || "maintainer") && {
        id: "danger",
        name: "Danger zone",
        href: `/projects/${currentProject.slug}/settings/danger`,
      },
    ],
    [currentProject.slug],
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
