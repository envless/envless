import React from "react";
import type { SettingProps } from "@/types/projectSettingTypes";
import Tabs from "@/components/settings/Tabs";
import { Container, Input } from "../theme";

type ActiveType = "general" | "branches" | "danger";

type Props = { active: ActiveType; children: React.ReactNode } & SettingProps;

const ProjectSettings = ({
  projects,
  currentProject,
  active,
  children,
}: Props) => {
  console.log(projects, currentProject);
  const tabData = [
    {
      id: "general",
      name: "General",
      href: `/projects/${currentProject.id}/settings`,
    },
    {
      id: "branches",
      name: "Protected Branches",
      href: `/projects/${currentProject.id}/settings/protected-branch`,
    },
    {
      id: "danger",
      name: "Danger Zone",
      href: `/projects/${currentProject.id}/settings/danger`,
    },
  ];
  return (
    <>
      {/* <h1>SettingsPage for {currentProject.name}</h1> */}

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
