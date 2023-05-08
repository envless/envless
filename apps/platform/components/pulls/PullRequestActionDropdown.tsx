import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { Button } from "../theme";

type PullRequestActionItem = {
  label: string;
  onClick: () => void;
};

type PullRequestActionDropDownProps = {
  items: PullRequestActionItem[];
};

export default function PullRequestActionDropDown({
  items,
}: PullRequestActionDropDownProps) {
  return (
    <Menu as="div" className="relative z-10">
      <div>
        <Menu.Button
          rightIcon={
            <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0" />
          }
          variant="secondary"
          as={Button}
        >
          PR Actions
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="bg-darker ring-dark absolute left-0 mt-2 w-56 origin-top-right rounded-md shadow-xl ring-2 focus:outline-none">
          <ul className="divide-dark divide-y">
            {items.map((item) => (
              <Menu.Item key={item.label}>
                {({ active }) => (
                  <li className={clsx("p-3 text-xs", active && "bg-dark")}>
                    <button onClick={item.onClick}>{item.label}</button>
                  </li>
                )}
              </Menu.Item>
            ))}
          </ul>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
