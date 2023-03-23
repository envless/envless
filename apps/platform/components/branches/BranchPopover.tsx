import React, { ComponentProps } from "react";
import clsx from "clsx";
import { Check, ChevronDown, GitBranch, Search } from "lucide-react";
import { Hr, Popover } from "../theme";
import { BranchPopoverAlignment } from "../theme/Popover";

interface Props {
  branches: any;
  setBranches: any;
  selectedBranch: any;
  setSelectedBranch: any;
  outlined?: boolean;
  fullWidth?: boolean;
  buttonText?: string;
  zIndex?: 10 | 20 | 30 | 40 | 50;
}

export const BranchPopover = ({
  zIndex = 20,
  outlined = false,
  fullWidth = false,
  buttonText = "Current branch",
  branches,
  setBranches,
  selectedBranch,
  setSelectedBranch,
}: Props) => {
  return (
    <Popover
      zIndex={zIndex}
      align={BranchPopoverAlignment.end}
      fullButtonWidth={fullWidth}
      button={
        <button
          type="button"
          className={clsx(
            "border-dark hover:bg-darker inline-flex w-full items-center justify-between space-x-4 rounded border px-3 py-2  text-sm transition-colors duration-75",
            outlined ? "ring-light/50 ring-1" : "bg-dark",
          )}
        >
          <span className="flex flex-row items-center">
            <div>
              <GitBranch className="h-4 w-4" />
            </div>
            <span className="text-light ml-2 text-xs">{buttonText}</span>
          </span>

          <div className="flex flex-1 items-center justify-end space-x-2">
            <span className="w-full max-w-[125px] truncate font-semibold">
              {selectedBranch.name}
            </span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </button>
      }
    >
      <div className="text-xs">
        <div className="border-dark border-b px-3 py-3">
          <p className="font-semibold">Switch between branches</p>
        </div>

        <div className=" border-dark mt-1 flex items-center border-b px-3">
          <BranchSearchInput />
          <Hr />
        </div>

        <div className="text-sm">
          <BranchList
            branches={branches}
            setSelectedBranch={setSelectedBranch}
            setBranches={setBranches}
          />
        </div>
      </div>
    </Popover>
  );
};

function BranchSearchInput() {
  return (
    <>
      <Search className="text-light absolute mb-1.5 h-4 w-4" />
      <input
        type="text"
        name="search"
        id="search"
        className="w-full border-none bg-transparent pr-3 pl-6 pb-3 text-sm focus:outline-none focus:ring-0"
        placeholder="Find a branch..."
      />
    </>
  );
}

function BranchList({ branches, setSelectedBranch, setBranches }) {
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

  return (
    <ul className="flex w-full flex-col">
      {branches.map((branch) => (
        <button
          key={branch.id}
          type="button"
          onClick={() => handleSelectBranchClick(branch)}
        >
          <li className="hover:bg-dark inline-flex w-full items-center justify-between px-3 py-2">
            <span className="truncate">{branch.name}</span>
            {branch.isSelected && (
              <Check
                className="h-4 w-4 shrink-0 text-teal-300"
                aria-hidden="true"
              />
            )}
          </li>
        </button>
      ))}
    </ul>
  );
}

interface BranchPopoverButtonProps extends ComponentProps<"button"> {
  label: string;
  selectedBranch: string;
}
function BranchPopoverButton({
  label,
  selectedBranch,
}: BranchPopoverButtonProps) {
  return (
    <button
      type="button"
      className="border-dark ring-light/50 hover:bg-darker inline-flex w-full items-center  justify-between space-x-4 rounded border px-3 py-2 text-sm ring-1 transition-colors duration-75"
    >
      <span className="flex flex-row items-center">
        <div>
          <GitBranch className="h-4 w-4" />
        </div>
        <span className="text-light ml-2 text-xs">{label}</span>
      </span>

      <div className="flex flex-1 items-center justify-end space-x-2">
        <span className="font-semibold">{selectedBranch}</span>
        <ChevronDown className="h-4 w-4" />
      </div>
    </button>
  );
}
