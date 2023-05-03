import Link from "next/link";
import { useRouter } from "next/router";
import { clsx } from "clsx";

const Tabs = ({ active, options }) => {
  const router = useRouter();

  return (
    <>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>

        <select
          id="tabs"
          name="tabs"
          className="border-dark bg-dark block rounded text-sm"
          // @ts-ignore
          defaultValue={options.find((tab) => tab.id === active).name}
          onChange={(e) => {
            const selectedTab = options.find(
              (tab) => tab.name === e.target.value,
            );

            // @ts-ignore
            router.push(selectedTab.href);
          }}
        >
          {options.map((tab) => (
            <option key={tab.id} className="text-sm">
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <ul className="-ml-3 hidden sm:block">
        {options.map((tab) => (
          <Link href={tab.href} key={tab.id}>
            <li
              className={clsx(
                active === tab.id ? "text-teal-300" : "text-lighter",
                "hover:bg-darker mr-6 cursor-pointer rounded px-3 py-2 text-sm",
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
