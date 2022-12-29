import {
  GoFileCode,
  GoGitBranch,
  GoGitPullRequest,
  GoOrganization,
  GoGear,
} from "react-icons/go";

import Link from "next/link";
import { useRouter } from "next/router";
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
      icon: GoFileCode,
    },
    {
      id: "branches",
      name: "Branches",
      href: `${projectUrl}/branches`,
      icon: GoGitBranch,
    },
    {
      id: "mrs",
      name: "Merge Requests",
      href: `${projectUrl}/merge-requests`,
      icon: GoGitPullRequest,
    },
    {
      id: "members",
      name: "Members",
      href: `${projectUrl}/members`,
      icon: GoOrganization,
    },
    {
      id: "settings",
      name: "Settings",
      href: `${projectUrl}/settings`,
      icon: GoGear,
    },
  ];

  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <Container>
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-dark bg-dark"
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
        <div className="border-b border-dark">
          <Container>
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={classNames(
                    tab.id === active
                      ? "border-teal-300 text-teal-300"
                      : "lighter border-transparent hover:border-dark hover:text-teal-300",
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
