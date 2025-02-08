import { UserRole } from "@prisma/client";
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

export const getProjectSettingTabs = (
  currentUserRole: UserRole,
  slug: string,
) => {
  let tabs: ProjectSettingTab[] = [];

  const authorizedRoles: UserRole[] = [UserRole.owner, UserRole.maintainer];

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

  if (currentUserRole === UserRole.owner) {
    tabs.push({
      id: "danger",
      name: "Danger zone",
      href: `/projects/${slug}/settings/danger`,
    });
  }

  return tabs;
};

export const getNavigationTabs = (currentUserRole, projectUrl) => {
  const authorizedRoles = [UserRole.owner, UserRole.maintainer];

  const defaultTabs = [
    {
      id: "project",
      name: "Project",
      href: `${projectUrl}`, // This is the default
      icon: LayoutGrid,
    },
    {
      id: "pr",
      name: "Pull requests",
      href: `${projectUrl}/pulls`,
      icon: GitPullRequest,
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
    defaultTabs.push(
      {
        id: "members",
        name: "Members",
        href: `${projectUrl}/members`,
        icon: Users,
      },
      {
        id: "settings",
        name: "Settings",
        href: `${projectUrl}/settings`,
        icon: Settings2,
      },
    );
  }

  return defaultTabs;
};

export const downloadAsTextFile = (filename, text) => {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text),
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const parseDotEnvContents = (contents: string) => {
  // Borrowed from https://github.com/motdotla/dotenv/blob/master/lib/main.js
  const LINE =
    /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/gm;

  const obj = {};

  // Convert buffer to string
  let lines = contents.toString();

  // Convert line breaks to same format
  lines = lines.replace(/\r\n?/gm, "\n");

  let match;
  while ((match = LINE.exec(lines)) != null) {
    const key = match[1];

    // Default undefined or null to empty string
    let value = match[2] || "";

    // Remove whitespace
    value = value.trim();

    // Check if double quoted
    const maybeQuote = value[0];

    // Remove surrounding quotes
    value = value.replace(/^(['"`])([\s\S]*)\1$/gm, "$2");

    // Expand newlines if double quoted
    if (maybeQuote === '"') {
      value = value.replace(/\\n/g, "\n");
      value = value.replace(/\\r/g, "\r");
    }

    // Add to object
    obj[key] = value;
  }

  return obj;
};

export const getPaginationText = (
  pagination: { pageIndex; pageSize },
  totalItems: number,
) => {
  return `Showing ${
    totalItems > 0 ? pagination.pageIndex * pagination.pageSize + 1 : 0
  } to ${
    (pagination.pageIndex + 1) * pagination.pageSize > totalItems
      ? totalItems
      : (pagination.pageIndex + 1) * pagination.pageSize
  } of ${totalItems} `;
};
