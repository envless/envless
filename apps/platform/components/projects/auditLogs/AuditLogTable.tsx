import { useMemo } from "react";
import { Audit } from "@prisma/client";
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Columns, Filter, Search } from "lucide-react";
import { BaseInput, Button } from "@/components/theme";

type AuditLogTableProps = {
  auditLogs: any;
  setSlideOverOpen: (open: boolean) => void;
  pagination: PaginationState;
  setPagination: (pagination: PaginationState) => void;
  pageCount: number;
  totalAuditLogs: number;
};

export default function AuditLogTable({
  auditLogs,
  setSlideOverOpen,
  pagination,
  setPagination,
  pageCount,
  totalAuditLogs,
}: AuditLogTableProps) {
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: "Created By",
        id: "createdBy",
        accessorFn: (row) => row.createdBy.name,
        cell: (info) => (
          <div className="flex items-center gap-x-3">
            <img
              src={info.row.original.avatar}
              className="h-10 w-10 rounded-full"
            />
            <div>
              <span className="block text-xs">
                {info.row.original.createdBy.name}
              </span>
            </div>
          </div>
        ),
      },
      {
        header: "Action Performed",
        id: "action",
        accessorFn: (row) => row.action,
        cell: (info) => (
          <span className="bg-lighter text-dark rounded-xl border px-2 py-0.5 text-xs tracking-tight">
            {info.row.original.action}
          </span>
        ),
      },
      {
        header: "Project",
        id: "project",
        accessorFn: (row) => row.project.name,
        cell: (info) => info.getValue(),
      },
      {
        header: "Created At",
        id: "createdAt",
        accessorFn: (row) => new Date(row.createdAt).toDateString(),
        cell: (info) => info.getValue(),
      },
      {
        id: "detail",
        cell: (info) => (
          <div className="text-right">
            <button
              onClick={() => setSlideOverOpen(true)}
              className="py-2 px-3 font-medium text-teal-400 duration-150 hover:text-teal-300 hover:underline"
            >
              Detail
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: auditLogs,
    columns,
    pageCount,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    debugTable: true,
  });

  return (
    <div className="border-dark mt-12 w-full overflow-x-auto rounded-md border-2 shadow-sm">
      <div className="border-dark flex items-center justify-end border-b py-2 px-2 font-medium">
        <div className="flex w-full items-center justify-end gap-2 md:max-w-md">
          <div className="flex flex-1 justify-end">
            <div className="group relative w-full">
              <div className="text-light group-focus-within:text-lighter pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3">
                <Search className="h-4 w-4" />
              </div>

              <BaseInput
                placeholder="Search"
                className="w-full max-w-xs py-1.5 !pl-9"
                full={false}
              />
            </div>
          </div>

          <div className="flex shrink-0 items-center">
            <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/25">
              <Filter className="h-5 w-5" />
            </button>
          </div>

          <div className="flex shrink-0 items-center">
            <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/25">
              <Columns className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <table className="w-full table-auto border-b-2 text-left text-sm">
        <thead className="border-dark border-b">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} className="py-3 px-6 text-xs font-medium">
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>

        <tbody className="divide-dark bg-darker divide-y">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  className="whitespace-nowrap py-3 px-6 text-xs"
                  key={cell.id}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between py-3 px-4 font-medium">
        <p className="text-xs">
          Showing {pagination.pageIndex + 1} to {pageCount} of {totalAuditLogs}{" "}
          items
        </p>
        <div className="flex items-center gap-3 text-xs">
          <Button
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            variant="primary"
            size="sm"
          >
            Previous
          </Button>
          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            variant="primary"
            size="sm"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
