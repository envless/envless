import React from "react";
import type { SettingProps } from "@/types/projectSettingTypes";
import Tabs from "@/components/settings/Tabs";

type ActiveType = "general" | "branches" | "danger";

type Props = { active: ActiveType; children: React.ReactNode } & Omit<
  SettingProps,
  "projectSetting"
>;

const ProjectSettings = ({
  projects,
  currentProject,
  active,
  children,
}: Props) => {
  const tabData = React.useMemo(
    () => [
      {
        id: "general",
        name: "General settings",
        href: `/projects/${currentProject.id}/settings`,
      },
      {
        id: "branches",
        name: "Protected branches",
        href: `/projects/${currentProject.id}/settings/protected-branch`,
      },
      {
        id: "danger",
        name: "Danger zone",
        href: `/projects/${currentProject.id}/settings/danger`,
      },
    ],
    [currentProject.id],
  );

  return (
    <>
      <div className="mb-4 w-full px-4 md:mb-0 md:w-1/2 lg:w-1/3">
        <Tabs active={active} tabData={tabData} />
      </div>

      <div className="mb-4 w-full px-4 md:mb-0 md:w-1/2 lg:w-2/3">
        {children}
      </div>
    </>
  );
};

export default ProjectSettings;
