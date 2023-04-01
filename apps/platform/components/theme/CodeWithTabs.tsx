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
      <nav className="mt-5 flex space-x-5" aria-label="Tabs">
        {tabs.map((tab, index) => (
          <span
            key={index}
            onClick={() => {
              setActiveTab(tab);
            }}
            className={clsx(
              "text-light hover:text-lighter cursor-pointer whitespace-nowrap border-b-2 border-transparent text-sm font-medium hover:border-gray-300",
              activeTab.label === tab.label ? "text-teal-400" : "",
            )}
          >
            {tab.label}
          </span>
        ))}
      </nav>

      <Code copy={true} language={activeTab.lang} code={activeTab.snippet} />
    </Fragment>
  );
};

export default CodeWithTabs;
