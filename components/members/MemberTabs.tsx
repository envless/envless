import clsx from "clsx";

interface TabProps {
  tab: string;
  setTab: (tab: "active" | "inactive" | "pending") => void;
  setQuery: (query: string) => void;
}

const MemberTabs = ({ tab, setTab, setQuery }: TabProps) => {
  return (
    <div className="min-w-full rounded-t bg-darker p-5">
      <nav className="flex" aria-label="Tabs">
        <button
          onClick={() => setTab("active")}
          className={clsx(
            "rounded-md px-3 py-1 text-sm font-medium",
            tab === "active"
              ? "bg-dark text-teal-300"
              : "text-light hover:text-lighter",
          )}
        >
          Active
        </button>

        <button
          onClick={() => setTab("pending")}
          className={clsx(
            "rounded-md px-3 py-1 text-sm font-medium",
            tab === "pending"
              ? "bg-dark text-teal-300"
              : "text-light hover:text-lighter",
          )}
        >
          Pending
        </button>

        <button
          onClick={() => setTab("inactive")}
          className={clsx(
            "rounded-md px-3 py-1 text-sm font-medium",
            tab === "inactive"
              ? "bg-dark text-teal-300"
              : "text-light hover:text-lighter",
          )}
        >
          Inactive
        </button>

        <div className="flex-1">
          <input
            type="text"
            className="input-primary float-right max-w-md justify-end py-1.5 text-sm"
            placeholder="Search members..."
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </nav>
    </div>
  );
};

export default MemberTabs;
