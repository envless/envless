import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { LucideIcon } from "lucide-react";
import Filters from "./Filters";

export type FilterOption = {
  label: string;
  value: string;
  order?: string;
};

export type FilterOptions = {
  [key: string]: FilterOption[];
};
interface TableProps<T extends object> {
  data: T[];
  hasFilters?: boolean;
  variant?: "dark" | "darker";
  columns: ColumnDef<T>[];
  visibleColumns?: VisibilityState | undefined;
  filterOptions?: FilterOptions;
  emptyStateProps: {
    title: string;
    description?: string;
    icon: LucideIcon;
    actionText: string;
    onActionClick?: () => void;
  };
}

export function Table<T extends object>({
  visibleColumns = {},
  hasFilters = true,
  variant = "dark",
  data,
  columns,
  filterOptions,
  emptyStateProps,
}: TableProps<T>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      globalFilter,
      sorting,
    },
    initialState: {
      columnVisibility: visibleColumns,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugAll: true,
  });

  return (
    <div className="inline-block min-w-full py-4 align-middle">
      <div className="ring-darker shadow ring-1 ring-opacity-5 md:rounded">
        {data.length > 2 && hasFilters && (
          <div className="bg-darker min-w-full rounded-t pt-3">
            <Filters
              filterOptions={filterOptions}
              columnFilters={columnFilters}
              table={table}
            />
          </div>
        )}
        {data.length === 0 ? (
          <div
            className={clsx(
              "bg-darker mx-auto w-full max-w-screen-xl px-5 py-8 transition duration-300 lg:py-12 xl:px-16",
              hasFilters && "border-dark border-t",
            )}
          >
            <div className="text-center">
              <emptyStateProps.icon className="text-light mx-auto h-6 w-6" />
              <h3 className="text-lighter mt-4 text-xl font-semibold">
                {emptyStateProps.title}
              </h3>
              <p className="text-light mx-auto mt-4 max-w-md text-sm">
                {emptyStateProps.description
                  ? emptyStateProps.description
                  : "You can get started by"}{" "}
                <span
                  onClick={() =>
                    emptyStateProps.onActionClick &&
                    emptyStateProps.onActionClick()
                  }
                  className="text-teal-300 transition duration-300 hover:cursor-pointer hover:underline"
                >
                  {emptyStateProps.actionText}
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="divide-light min-w-full divide-y">
              <tbody
                className={clsx({
                  "bg-dark": variant === "dark",
                  "bg-darker": variant === "darker",
                })}
              >
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="min-w-max whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
