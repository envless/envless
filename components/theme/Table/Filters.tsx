import { useEffect, useState } from "react";
import {
  ColumnFilter,
  ColumnFiltersState,
  ColumnSort,
  RowData,
  Table,
} from "@tanstack/react-table";
import FilterMenu from "./FilterMenu";
import SearchInput from "./SearchInput";
import { FilterOption, FilterOptions } from "./Table";

interface FilterTableProps {
  option: FilterOption & { id: string };
  filterType: string;
}

function FilterPill({ option, filterType }: FilterTableProps) {
  return (
    <span className="m-1 inline-flex items-center rounded-full border border-dark bg-darkest py-1.5 pl-3 pr-2 text-xs text-lighter">
      {filterType === "sort" ? (
        <span>sort: {option.label}</span>
      ) : (
        <span>
          {option.id}: {option.label}
        </span>
      )}
      <button
        type="button"
        className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-light hover:bg-dark hover:text-lighter"
        onClick={() => {}}
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
}

interface FilterProps<T extends RowData> {
  columnFilters: ColumnFiltersState;
  table: Table<T>;
  filterOptions?: FilterOptions;
}

export default function Filters<T extends RowData>({
  table,
  filterOptions,
}: FilterProps<T>) {
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      table.setGlobalFilter(filter);
    }, 300);
    return () => clearTimeout(timeout);
  }, [filter, table]);

  const filterWithColumn = (columnFilter: ColumnFilter) => {
    let option: FilterOption & { id: string } = {
      id: columnFilter.id,
      label: "",
      order: "",
      value: columnFilter.value as string,
    };

    option = mergeColumnAndFilter(option)[0];

    console.log(option);

    return option;
  };

  const sortWithColumn = (columnSort: ColumnSort) => {
    let option: FilterOption & { id: string } = {
      id: columnSort.id,
      label: "",
      order: columnSort.desc ? "desc" : "asc",
      value: columnSort.id,
    };

    option = mergeColumnAndFilter(option)[0];

    return option;
  };

  const mergeColumnAndFilter = (option) => {
    return Object.keys(filterOptions ?? []).map((key) => {
      let options = filterOptions && filterOptions[option.id];
      const columnId = option.id;

      if (option.order) {
        options = filterOptions && filterOptions["sort"];
        option = options?.filter(
          (o) => o.value === option.value && o.order === option.order,
        )[0] as FilterOption & { id: string };
      } else {
        options = filterOptions && filterOptions[option.id];
        option = options?.filter(
          (o) => o.value === option.value,
        )[0] as FilterOption & { id: string };
      }

      option.id = columnId;

      return option;
    });
  };

  return (
    <div>
      {/* Filters */}
      <section aria-labelledby="filter-heading">
        <h2 id="filter-heading" className="sr-only">
          Filters
        </h2>

        <div className="border-b border-dark pb-4">
          <div className="mx-auto flex max-w-7xl px-4 sm:px-6 lg:px-8">
            {Object.keys(filterOptions ?? []).map((key) => {
              const options = filterOptions && filterOptions[key];

              return (
                <FilterMenu
                  key={key}
                  buttonText={key}
                  filterType={key === "sort" ? "sort" : "filter"}
                  table={table}
                  options={options ?? []}
                />
              );
            })}

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
                  return (
                    <div key={index}>
                      <FilterPill
                        filterType="filter"
                        option={filterWithColumn(columnFilter)}
                      />
                    </div>
                  );
                })}

                {table.getState().sorting.map((sort, index) => {
                  return (
                    <div key={index}>
                      <FilterPill
                        filterType="sort"
                        option={sortWithColumn(sort)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
