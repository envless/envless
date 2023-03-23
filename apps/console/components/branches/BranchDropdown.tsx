import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Check, ChevronDown, GitBranch, Search } from "lucide-react";
import { useForm } from "react-hook-form";

interface BranchDropdownProps {
  branches: any;
  setSelectedBranch: any;
  selectedBranch: any;
  setBranches: any;
}

export default function BranchDropdown({
  branches,
  setSelectedBranch,
  selectedBranch,
  setBranches,
}: BranchDropdownProps) {
  const handleSelectBranchClick = (branch) => {
    setBranches([
      ...branches.map((b) => {
        return {
          ...b,
          isSelected: b.id === branch.id,
        };
      }),
    ]);

    setSelectedBranch(branch);
  };

  const { register } = useForm();

  return (
    <Menu as="div" className="relative mt-4 inline-block w-full max-w-[200px]">
      <div className="w-full">
        <Menu.Button className="inline-flex w-full items-center truncate rounded border border-dark bg-dark px-3 py-2 text-sm transition-colors duration-75 hover:bg-darker">
          <div className="flex items-center">
            <GitBranch className="mr-2 h-4 w-4 shrink-0" />
            <span className="mr-2 block text-xs text-light">
              Current Branch
            </span>
          </div>

          <div className="flex items-center space-x-2 justify-self-end">
            <span className="max-w-[34px] truncate text-sm font-semibold">
              {selectedBranch.name}
            </span>
            <ChevronDown
              aria-hidden="true"
              className="h-4 w-4 shrink-0 justify-self-end"
            />
          </div>
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
        <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left rounded-md bg-darker shadow-xl ring-2 ring-dark focus:outline-none ">
          <div className="border-b border-dark px-3 py-3 text-xs">
            <p className="font-semibold">Switch between branches</p>
          </div>

          <form>
            <div className="mt-1 flex items-center border-b border-dark px-3 text-xs">
              <Search className="absolute mb-1.5 h-4 w-4 text-light" />
              <input
                type="text"
                id="search"
                className="w-full border-none bg-transparent pr-3 pl-6 text-sm focus:outline-none focus:ring-0"
                placeholder="Find a branch..."
                {...register("search")}
              />
            </div>
          </form>

          <ul className="flex w-full flex-col text-xs">
            {branches.map((branch) => (
              <Menu.Item
                as="button"
                key={branch.id}
                onClick={() => handleSelectBranchClick(branch)}
              >
                {({ active }) => (
                  <li
                    className={clsx(
                      "inline-flex w-full items-center justify-between px-3 py-2",
                      active ? "bg-dark" : "",
                    )}
                  >
                    <span className="truncate">{branch.name}</span>
                    {branch.isSelected && (
                      <Check
                        className="h-4 w-4 shrink-0 text-teal-300"
                        aria-hidden="true"
                      />
                    )}
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
