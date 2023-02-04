import Link from "next/link";
import { useRouter } from "next/router";
import {
  GitBranch,
  GitPullRequest,
  LayoutGrid,
  LayoutList,
  Settings2,
  Users,
} from "lucide-react";
import { Container } from "@/components/theme";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

interface Props {
  active: String;
  projectId: String;
}

export default function Tabs({ active, projectId }: Props) {
  const router = useRouter();
  const projectUrl = `/projects/${projectId}`;
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
            className="block rounded border-dark-700 bg-dark-700 text-sm"
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
        <div className="border-b border-dark-700">
          <Container>
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={classNames(
                    tab.id === active
                      ? "border-teal-300 text-teal-300"
                      : "lll2 border-transparent hover:border-dark-700 hover:text-teal-300",
                    "group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium",
                  )}
                  aria-current={tab.id === active ? "page" : undefined}
                >
                  <tab.icon
                    className={classNames(
                      tab.id === active
                        ? "text-teal-300"
                        : "group-hover:lll2 text-lll2",
                      "-ml-0.5 mr-2 h-5 w-5",
                    )}
                    aria-hidden="true"
                  />
                  <span>{tab.name}</span>
                </Link>
              ))}
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
