import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import useFuse from "@/hooks/useFuse";
import { getAvatar } from "@/utils/getAvatar";
import {
  downloadAsTextFile,
  formatDateTime,
  getPaginationText,
} from "@/utils/helpers";
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import * as csvParser from "papaparse";
import { BaseInput } from "@/components/theme";

type AuditLogTableProps = {
  auditLogs: any;
  allAuditLogs: any;
  setAllAuditLogs: (auditLogs: any) => void;
  resetAllAuditLogs: () => void;
  setSlideOverOpen: (open: boolean) => void;
  pagination: PaginationState;
  setPagination: (pagination: PaginationState) => void;
  pageCount: number;
  setAuditLogDetail: (auditLog: any) => void;
};

export default function AuditLogTable({
  auditLogs,
  allAuditLogs,
  setAllAuditLogs,
  resetAllAuditLogs,
  setSlideOverOpen,
  pagination,
  setPagination,
  pageCount,
  setAuditLogDetail,
}: AuditLogTableProps) {
  const [query, setQuery] = useState("");

  const fuseOptions = {
    keys: ["createdBy.name", "createdBy.email", "action"],
    threshold: 0.2,
    findAllMatches: true,
  };
  const results = useFuse(allAuditLogs, query, fuseOptions);

  // this useRef is used to prevent infinite loop of updates of the page
  const resultsRef = useRef(results);

  useEffect(() => {
    resultsRef.current = results;
  }, [results]);

  useEffect(() => {
    if (query.length === 0) {
      resetAllAuditLogs();
    } else {
      const collection = resultsRef.current.map((result) => result.item);
      setAllAuditLogs(collection);
      setPagination({ ...pagination, pageIndex: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: "Created by",
        id: "createdBy",
        accessorFn: (row) => row.createdBy.name,
        cell: (info) => (
          <div className="flex items-center gap-x-3">
            <Image
              className="h-8 w-8 rounded-full"
              src={getAvatar(info.row.original.createdBy)}
              alt={`${
                info.row.original.createdBy.name ||
                info.row.original.createdBy.email
              } picture`}
              width={32}
              height={32}
            />

            <div>
              <span className="block text-xs">
                {info.row.original.createdBy.name}
              </span>
              <span className="text-xs text-gray-400">
                {info.row.original.createdBy.email}
              </span>
            </div>
          </div>
        ),
      },
      {
        header: "Action",
        id: "action",
        accessorFn: (row) => row.action,
        cell: (info) => (
          <span className="bg-lighter text-dark rounded-xl border px-2 py-0.5 text-xs tracking-tight">
            {info.row.original.action}
          </span>
        ),
      },

      {
        header: "Timestamp",
        id: "createdAt",
        accessorFn: (row) => new Date(row.createdAt).toDateString(),
        cell: (info) => info.getValue(),
      },
      {
        id: "detail",
        cell: (info) => (
          <div className="text-right">
            <button
              onClick={() => {
                setAuditLogDetail(info.row.original);
                setSlideOverOpen(true);
              }}
              className="px-3 py-2 font-medium text-teal-400 duration-150 hover:text-teal-300 hover:underline"
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
    <div className="border-dark w-full rounded-md border-2 shadow-sm">
      <div className="border-dark flex items-center justify-between border-b px-2 py-2 font-medium">
        <div className="flex w-full items-center justify-between px-4">
          <div className="group relative w-full">
            <div className="text-light group-focus-within:text-lighter pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3">
              <Search className="h-4 w-4" aria-hidden="true" />
            </div>
            <BaseInput
              placeholder="Search"
              className="w-full max-w-xs py-1.5 !pl-9"
              full={false}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex shrink-0 items-center">
            <button
              aria-label="Download as CSV"
              data-balloon-pos="up"
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/25"
              onClick={() => {
                const dataForCSV = allAuditLogs.map((auditLog: any) => {
                  return {
                    CreatedBy: auditLog.createdBy.name,
                    Action: auditLog.action,
                    Data: JSON.stringify(auditLog.data),
                    CreatedAt: formatDateTime(auditLog.createdAt),
                  };
                });

                const csv = csvParser.unparse(dataForCSV);
                downloadAsTextFile("audit-logs.csv", csv);
              }}
            >
              <Download className="h-5 w-5" />
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
                  <th key={header.id} className="px-6 py-3 text-xs font-medium">
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
                  className="whitespace-nowrap px-6 py-3 text-xs"
                  key={cell.id}
                  style={{ width: cell.column.getSize() }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between px-4 py-3 font-medium">
        <p className="text-xs">
          {getPaginationText(pagination, allAuditLogs.length)}
        </p>
        <div className="flex items-center gap-3 text-xs">
          <button
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            className={clsx(
              "flex items-center gap-x-1",
              !table.getCanPreviousPage() && "text-light cursor-not-allowed",
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={clsx(
              "flex items-center gap-x-1",
              !table.getCanNextPage() && "text-light cursor-not-allowed",
            )}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
