import {
  GitBranch,
  GitPullRequest,
  LayoutGrid,
  LayoutList,
  Settings2,
  Users,
  Zap,
} from "lucide-react";

export const formatDateTime = (date: Date) => {
  return new Date(date).toLocaleString("en-us", {
    month: "short",
    year: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

export const getInitials = (string: string) => {
  const names = string.split(" ");
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  } else {
    initials += names[0].substring(1, 2).toUpperCase();
  }

  return initials;
};

interface ProjectSettingTab {
  id: string;
  name: string;
  href: string;
}

export const getProjectSettingTabs = (currentUserRole, slug) => {
  let tabs: ProjectSettingTab[] = [];

  const authorizedRoles = ["owner", "maintainer"];

  if (authorizedRoles.includes(currentUserRole)) {
    tabs.push(
      {
        id: "general",
        name: "General settings",
        href: `/projects/${slug}/settings`,
      },
      {
        id: "branches",
        name: "Protected branches",
        href: `/projects/${slug}/settings/protected-branch`,
      },
    );
  }

  if (currentUserRole === "owner") {
    tabs.push({
      id: "danger",
      name: "Danger zone",
      href: `/projects/${slug}/settings/danger`,
    });
  }

  return tabs;
};

export const getNavigationTabs = (currentUserRole, projectUrl) => {
  const authorizedRoles = ["owner", "maintainer"];

  const defaultTabs = [
    {
      id: "project",
      name: "Project",
      href: `${projectUrl}`, // This is the default
      icon: LayoutGrid,
    },
    {
      id: "branches",
      name: "Branches",
      href: `${projectUrl}/branches`,
      icon: GitBranch,
    },
    {
      id: "pr",
      name: "Pull requests",
      href: `${projectUrl}/pulls`,
      icon: GitPullRequest,
    },
    {
      id: "members",
      name: "Members",
      href: `${projectUrl}/members`,
      icon: Users,
    },
    {
      id: "integrations",
      name: "Integrations",
      href: `${projectUrl}/integrations`,
      icon: Zap,
    },
    {
      id: "audits",
      name: "Audit logs",
      href: `${projectUrl}/audits`,
      icon: LayoutList,
    },
  ];

  if (authorizedRoles.includes(currentUserRole)) {
    defaultTabs.push({
      id: "settings",
      name: "Settings",
      href: `${projectUrl}/settings`,
      icon: Settings2,
    });
  }

  return defaultTabs;
};
