import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Branch } from "@prisma/client";
import clsx from "clsx";
import Fuse from "fuse.js";
import { Check, ChevronDown, GitBranch, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { truncate } from "@/lib/helpers";

interface BranchDropdownProps {
  label: string;
  dropdownLabel?: string;
  branches: Branch[] | any;
  selectedBranch: any;
  full?: boolean;
  onClick?: (branch: Branch | any) => void;
  currentProjectSlug: string;
}

export default function BranchDropdown({
  label,
  dropdownLabel,
  branches,
  selectedBranch,
  full,
  onClick,
  currentProjectSlug,
}: BranchDropdownProps) {
  const [searchData, setSearchData] = useState(branches);
  const { register } = useForm();

  /**Trigger re-render on serversideprops refresh**/
  useEffect(() => {
    setSearchData(branches);
  }, [branches]);

  const fuzzySearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fuse = new Fuse(branches, {
      shouldSort: true,
      threshold: 0.1,
      location: 0,
      distance: 100,
      keys: ["name", "description"],
    });

    const result = fuse.search(event.target.value);

    setSearchData(result.length ? result.map((item) => item.item) : branches);
  };

  const branchLink = (branchName: string) => {
    return `/projects/${currentProjectSlug}?branch=${branchName}`;
  };

  return (
    <Menu as="div" className="relative z-10 inline-block">
      <>
        <Menu.Button
          className={clsx(
            "border-dark bg-dark hover:bg-darker inline-flex items-center truncate rounded border px-3 py-2 text-sm transition-colors duration-75",
            full && "w-[27.599rem] justify-between",
          )}
        >
          <div className="flex items-center">
            <GitBranch className="mr-2 h-4 w-4 shrink-0" />
            <span className="text-light mr-2 block text-xs">{label}</span>
          </div>

          {full ? (
            <>
              <span className="max-w-[34px] text-sm font-semibold">
                {truncate(selectedBranch.name, 18)}
              </span>
              <ChevronDown
                aria-hidden="true"
                className="h-4 w-4 shrink-0 justify-self-end"
              />
            </>
          ) : (
            <div className="flex items-center space-x-2 justify-self-end">
              <span className="max-w-[34px] truncate text-sm font-semibold">
                {selectedBranch.name}
              </span>
              <ChevronDown
                aria-hidden="true"
                className="h-4 w-4 shrink-0 justify-self-end"
              />
            </div>
          )}
        </Menu.Button>
      </>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="bg-darker ring-dark absolute left-0 mt-2 w-56 origin-top-left rounded-md shadow-xl ring-2 focus:outline-none ">
          <div className="border-dark border-b px-3 py-3 text-xs">
            <p className="font-semibold">{dropdownLabel}</p>
          </div>

          <form>
            <div className="border-dark mt-1 flex items-center border-b px-3 text-xs">
              <Search className="text-light absolute mb-1.5 h-4 w-4" />
              <input
                type="text"
                id="search"
                className="w-full border-none bg-transparent pr-3 pl-6 text-sm focus:outline-none focus:ring-0"
                placeholder="Find a branch..."
                {...register("search", {
                  onChange: fuzzySearch,
                })}
              />
            </div>
          </form>

          <ul className="flex max-h-52 w-full flex-col overflow-y-auto text-xs [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden">
            {searchData.map((branch) => (
              <Menu.Item
                as="button"
                key={branch.id}
                onClick={() => onClick && onClick(branch)}
              >
                {({ active }) => (
                  <Link href={branchLink(branch.name)}>
                    <li
                      className={clsx(
                        "inline-flex w-full items-center justify-between px-3 py-2",
                        active && "bg-dark",
                      )}
                    >
                      <span className="truncate">{branch.name}</span>
                      {branch.name === selectedBranch.name && (
                        <Check
                          className="h-4 w-4 shrink-0 text-teal-300"
                          aria-hidden="true"
                        />
                      )}
                    </li>
                  </Link>
                )}
              </Menu.Item>
            ))}
          </ul>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
