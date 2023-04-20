import Link from "next/link";
import { useRouter } from "next/router";
import { getNavigationTabs } from "@/utils/helpers";
import type { UserRole } from "@prisma/client";
import { Container } from "@/components/theme";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

interface Props {
  active: string;
  projectSlug: string;
  currentRole: UserRole | string;
}

export default function Tabs({ active, projectSlug, currentRole }: Props) {
  const router = useRouter();
  const projectUrl = `/projects/${projectSlug}`;
  const tabs = getNavigationTabs(currentRole, projectUrl);

  return (
    <div className="mb-5">
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
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={classNames(
                    tab.id === active
                      ? "border-teal-300 text-teal-300"
                      : "lighter hover:border-dark border-transparent hover:text-teal-300",
                    "group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium",
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
