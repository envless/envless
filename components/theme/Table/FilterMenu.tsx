import { Fragment } from "react";
import { capitalizeText } from "@/utils/helpers";
import { Menu, Transition } from "@headlessui/react";
import { RowData, Table } from "@tanstack/react-table";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { FilterOption } from "./Table";

interface FilterMenuProps<T extends RowData> {
  filterType: "filter" | "sort";
  options: FilterOption[];
  table: Table<T>;
  buttonText: string;
}

export default function FilterMenu<T extends RowData>({
  buttonText,
  filterType,
  options,
  table,
}: FilterMenuProps<T>) {
  return (
    <Menu as="div" className="relative mr-6 hidden text-left sm:inline-block">
      <div>
        <Menu.Button className="group inline-flex justify-center text-sm font-medium text-light hover:text-lighter">
          {capitalizeText(buttonText)}
          <ChevronDown
            className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-light group-hover:text-lighter"
            aria-hidden="true"
          />
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
        <Menu.Items className="absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-md bg-darker shadow-2xl ring-2 ring-light ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {options.map((option) => (
              <Menu.Item key={option.label}>
                {({ active }) => (
                  <button
                    onClick={() => {
                      if (filterType === "filter") {
                        table.setColumnFilters((filters) => [
                          ...filters,
                          { id: buttonText, value: option.value },
                        ]);
                      } else if (filterType === "sort") {
                        table
                          .getColumn(option.value)
                          ?.toggleSorting(
                            option.order === "desc" ? true : false,
                          );
                      }
                    }}
                    className={clsx(
                      active ? "w-full bg-dark text-left" : "",
                      "block px-4 py-2 text-xs text-lighter",
                    )}
                  >
                    {option.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
