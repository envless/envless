import { Project, ProjectSetting } from "@prisma/client";

export interface SettingProps {
  projects: Project[];
  currentProject: Project;
  projectSetting: ProjectSetting;
}
