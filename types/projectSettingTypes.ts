import { Project } from "@prisma/client";

export interface SettingProps {
  projects: Project[];
  currentProject: Project;
}
