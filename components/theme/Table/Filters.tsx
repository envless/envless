import { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ColumnFiltersState, RowData, Table } from "@tanstack/react-table";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import SearchInput from "./SearchInput";

const sortOptions = [
  { key: "createdAt.asc", value: "Newest" },
  { key: "createdAt.desc", value: "Oldest" },
  { key: "updatedAt.asc", value: "Recently updated" },
  { key: "updatedAt.desc", value: "Least recently updated" },
];

const statusOptions = [
  { key: "open", value: "Open" },
  { key: "closed", value: "Closed" },
  { key: "merged", value: "Merged" },
];

const authorsOptions = [
  { id: 111, label: "John Doe" },
  { id: 222, label: "Jane Doe" },
  { id: 333, label: "Will Smith" },
];

const selectedOptions = {
  author: { id: 111, name: "John Doe" },
  status: [{ value: "open", label: "Open" }],
  sort: { name: "Newest", key: "createdAt.asc" },
};

const Filter = (key, option) => {
  return (
    <span
      key={option.id || option.key || option.value}
      className="m-1 inline-flex items-center rounded-full border border-dark bg-darkest py-1.5 pl-3 pr-2 text-xs text-lighter"
    >
      <span>
        {key}: {option.value || option.name}
      </span>
      <button
        type="button"
        className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-light hover:bg-dark hover:text-lighter"
      >
        <span className="sr-only">
          Remove filter for {option.value || option.name}
        </span>
        <svg
          className="h-2 w-2"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 8 8"
        >
          <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
        </svg>
      </button>
    </span>
  );
};

interface FilterProps<T extends RowData> {
  columnFilters: ColumnFiltersState;
  table: Table<T>;
}

export default function Filters<T extends RowData>({ table }: FilterProps<T>) {
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      table.setGlobalFilter(filter);
    }, 300);
    return () => clearTimeout(timeout);
  }, [filter, table]);

  return (
    <div className="">
      {/* Filters */}
      <section aria-labelledby="filter-heading">
        <h2 id="filter-heading" className="sr-only">
          Filters
        </h2>

        <div className="border-b border-dark pb-4">
          <div className="mx-auto flex max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Sort */}
            <Menu
              as="div"
              className="relative mr-6 hidden text-left sm:inline-block"
            >
              <div>
                <Menu.Button className="group inline-flex justify-center text-sm font-medium text-light hover:text-lighter">
                  Sort
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
                    {sortOptions.map((option) => (
                      <Menu.Item key={option.value}>
                        {({ active }) => (
                          <button
                            onClick={() => {
                              console.log("Sort by", option.key);
                            }}
                            className={clsx(
                              active ? "w-full bg-dark text-left" : "",
                              "block px-4 py-2 text-xs text-lighter",
                            )}
                          >
                            {option.value}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* Status */}
            <Menu
              as="div"
              className="relative mr-6 hidden text-left sm:inline-block"
            >
              <div>
                <Menu.Button className="group inline-flex justify-center text-sm font-medium text-light hover:text-lighter">
                  Status
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
                    {statusOptions.map((option) => (
                      <Menu.Item key={option.key}>
                        {({ active }) => (
                          <button
                            onClick={() => {
                              console.log("Sort by", option.key);
                            }}
                            className={clsx(
                              active ? "w-full bg-dark text-left" : "",
                              "block px-4 py-2 text-xs text-lighter",
                            )}
                          >
                            {option.value}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            <div className="flex flex-1 justify-end">
              <SearchInput
                table={table}
                filter={filter}
                setFilter={setFilter}
              />
            </div>
          </div>
        </div>

        {/* Active filters */}
        <div className="bg-darker/25">
          <div className="mx-auto max-w-7xl py-3 px-4 sm:flex sm:items-center sm:px-6 lg:px-8">
            <h3 className="text-sm font-medium text-light">
              Filters
              <span className="sr-only">, active</span>
            </h3>

            <div
              aria-hidden="true"
              className="hidden h-5 w-px bg-light sm:ml-4 sm:block"
            />

            <div className="mt-2 sm:mt-0 sm:ml-4">
              <div className="-m-1 flex flex-wrap items-center">
                {Object.keys(selectedOptions).map((key) => {
                  const option = selectedOptions[key];

                  if (option && Array.isArray(option)) {
                    return (
                      <div key={key}>{option.map((o) => Filter(key, o))}</div>
                    );
                  } else {
                    return Filter(key, option);
                  }
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
