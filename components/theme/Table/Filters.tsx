import { useEffect, useState } from "react";
import { ColumnFiltersState, RowData, Table } from "@tanstack/react-table";
import FilterMenu from "./FilterMenu";
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

const FilterTable = (option) => {
  return (
    <span className="m-1 inline-flex items-center rounded-full border border-dark bg-darkest py-1.5 pl-3 pr-2 text-xs text-lighter">
      <span>
        {option.id}: {option.value}
      </span>
      <button
        type="button"
        className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-light hover:bg-dark hover:text-lighter"
      >
        <span className="sr-only">Remove filter for {option.value}</span>
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
    <div>
      {/* Filters */}
      <section aria-labelledby="filter-heading">
        <h2 id="filter-heading" className="sr-only">
          Filters
        </h2>

        <div className="border-b border-dark pb-4">
          <div className="mx-auto flex max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Sort */}
            <FilterMenu
              buttonText="Sort"
              filterType="sort"
              table={table}
              options={sortOptions}
            />

            {/* Status */}
            <FilterMenu
              buttonText="Status"
              filterType="filter"
              table={table}
              options={statusOptions}
            />

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
                {table.getState().columnFilters.map((columnFilter, index) => {
                  return <div key={index}>{FilterTable(columnFilter)}</div>;
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
