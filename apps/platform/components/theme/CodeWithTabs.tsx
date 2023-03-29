import { Fragment, useState } from "react";
import clsx from "clsx";
import Code from "@/components/theme/Code";

type TabProps = {
  label: string;
  lang: string;
  snippet: string;
};

interface Props {
  tabs: TabProps[];
}

const CodeWithTabs = ({ tabs }: Props) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <Fragment>
      <nav className="flex space-x-8" aria-label="Tabs">
        {tabs.map((tab, index) => (
          <button
            onClick={() => {
              setActiveTab(tab);
            }}
            className={clsx(
              "text-light hover:text-lighter whitespace-nowrap border-b-2 border-transparent pt-5 text-sm font-medium hover:border-gray-300",
              activeTab.label === tab.label ? "text-teal-400" : "",
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <Code copy={true} language={activeTab.lang} code={activeTab.snippet} />
    </Fragment>
  );
};

export default CodeWithTabs;
