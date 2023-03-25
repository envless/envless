import Link from "next/link";
import { useRouter } from "next/router";
import { useUserAccessStore } from "@/store/userRole";
import {
  GitBranch,
  GitPullRequest,
  LayoutGrid,
  LayoutList,
  Settings2,
  Users,
  Zap,
} from "lucide-react";
import { Container } from "@/components/theme";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

interface Props {
  active: String;
  projectSlug: String;
}

export default function Tabs({ active, projectSlug }: Props) {
  const isAdmin = useUserAccessStore((state) => state.isAdmin);

  const router = useRouter();
  const projectUrl = `/projects/${projectSlug}`;
  const tabs = [
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
    {
      id: "settings",
      name: "Settings",
      href: `${projectUrl}/settings`,
      icon: Settings2,
    },
  ];

  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>

        <Container>
          <select
            id="tabs"
            name="tabs"
            className="border-dark bg-dark block rounded text-sm"
            // @ts-ignore
            defaultValue={tabs.find((tab) => tab.id === active).name}
            onChange={(e) => {
              const selectedTab = tabs.find(
                (tab) => tab.name === e.target.value,
              );

              // @ts-ignore
              router.push(selectedTab.href);
            }}
          >
            {tabs.map((tab) => (
              <option key={tab.id}>{tab.name}</option>
            ))}
          </select>
        </Container>
      </div>

      <div className="hidden sm:block">
        <div className="border-dark border-b">
          <Container>
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => {
                if (tab.id === "members" && !isAdmin) {
                  return null;
                }
                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className={classNames(
                      tab.id === active
                        ? "border-teal-300 text-teal-300"
                        : "lighter hover:border-dark border-transparent hover:text-teal-300",
                      "group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium",
                    )}
                    aria-current={tab.id === active ? "page" : undefined}
                  >
                    <tab.icon
                      className={classNames(
                        tab.id === active
                          ? "text-teal-300"
                          : "group-hover:lighter text-lighter",
                        "-ml-0.5 mr-2 h-5 w-5",
                      )}
                      aria-hidden="true"
                    />
                    <span>{tab.name}</span>
                  </Link>
                );
              })}
            </nav>
          </Container>
        </div>
      </div>
    </div>
  );
}

Tabs.defaultProps = {
  active: "project",
};
