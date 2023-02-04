import Link from "next/link";
import { useRouter } from "next/router";
import { clsx } from "clsx";

const Tabs = ({ active }) => {
  const router = useRouter();
  const tabs = [
    {
      id: "account",
      name: "Account",
      href: "/settings",
    },
    {
      id: "security",
      name: "Security",
      href: "/settings/security",
    },
    {
      id: "audit",
      name: "Audit logs",
      href: "/settings/audits",
    },
  ];

  return (
    <>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>

        <select
          id="tabs"
          name="tabs"
          className="block rounded border-dark-700 bg-dark-700 text-sm"
          // @ts-ignore
          defaultValue={tabs.find((tab) => tab.id === active).name}
          onChange={(e) => {
            const selectedTab = tabs.find((tab) => tab.name === e.target.value);

            // @ts-ignore
            router.push(selectedTab.href);
          }}
        >
          {tabs.map((tab) => (
            <option key={tab.id} className="text-sm">
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <ul className="-ml-3 hidden sm:block">
        {tabs.map((tab) => (
          <Link href={tab.href} key={tab.id}>
            <li
              className={clsx(
                active === tab.id ? "text-teal-300" : "text-lll2",
                "mr-6 cursor-pointer rounded px-3 py-2 text-sm hover:bg-dark-800",
              )}
            >
              {tab.name}
            </li>
          </Link>
        ))}
      </ul>
    </>
  );
};

export default Tabs;
