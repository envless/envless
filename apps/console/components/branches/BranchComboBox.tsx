import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Check, ChevronsUpDown, GitBranch } from "lucide-react";
import { BranchWithNameAndId } from "./CreateBranchModal";

interface BranchComboBoxProps {
  inputPadding?: "sm" | "lg";
  inputLabel: string;
  branches: BranchWithNameAndId[];
  selectedBranch: BranchWithNameAndId;
  setSelectedBranch: Dispatch<SetStateAction<BranchWithNameAndId>>;
}

export default function BranchComboBox({
  inputPadding = "sm",
  inputLabel,
  branches,
  selectedBranch,
  setSelectedBranch,
}: BranchComboBoxProps) {
  const [query, setQuery] = useState("");

  let defaultInputPaddingClass = "!pl-28";

  if (inputPadding == "lg") {
    defaultInputPaddingClass = "!pl-32";
  }

  const filteredBranches =
    query === ""
      ? branches
      : branches.filter((branch) =>
          branch.name
            .toLowerCase()
            .includes(query.toLowerCase().replace(/\s+/g, "")),
        );

  return (
    <Combobox value={selectedBranch} onChange={setSelectedBranch}>
      <div className="relative mt-1">
        <div className="transition-color relative flex w-full items-center rounded-md sm:text-xs">
          <div className="absolute inline-flex h-full items-center overflow-hidden border-none px-3 sm:text-xs">
            <GitBranch className="mr-2 h-4 w-4 shrink-0" />
            <span className="text-light w-full">{inputLabel}</span>
          </div>

          <Combobox.Input
            className={clsx(
              "input-primary focus:ring-light w-full overflow-hidden text-sm focus:outline-none",
              defaultInputPaddingClass,
            )}
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(branch: BranchWithNameAndId) => branch.name}
          />

          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronsUpDown className="h-4 w-4" aria-hidden="true" />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Combobox.Options className="border-dark bg-darker absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-xs">
            {filteredBranches.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none px-4 py-2 text-white">
                Nothing found.
              </div>
            ) : (
              filteredBranches.map((branch) => (
                <Combobox.Option
                  key={branch.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-dark" : ""
                    }`
                  }
                  value={branch}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {branch.name}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 right-0 flex items-center pr-3 text-teal-400`}
                        >
                          <Check className="h-4 w-4" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}
