import { useState } from "react";
import {
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Copy, GitBranch } from "lucide-react";
import { Badge, Button, Label } from "@/components/theme";
import Filters from "./Filters";

type Branch = {
  id: number;
  name: string;
  description: string;
  base: string;
};

const allBranches: Branch[] = [
  {
    id: 1,
    name: "feat/image-upload",
    description: "Create 2 days ago by John Doe",
    base: "Open",
  },

  {
    id: 2,
    name: "feat/send-transactional-email",
    description: "Create 2 days ago by John Doe",
    base: "Closed",
  },

  {
    id: 3,
    name: "fix/center-the-div",
    description: "Create 2 days ago by John Doe",
    base: "Merged",
  },

  {
    id: 4,
    name: "chore/update-readme",
    description: "Create 2 days ago by John Doe",
    base: "Merged",
  },
];
const Table = () => {
  const columnHelper = createColumnHelper<Branch>();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = [
    columnHelper.display({
      id: "detail",
      cell: (props) => (
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
          <div className="flex items-center">
            <div className="h-10 w-10 flex-shrink-0">
              <Badge type="info">
                <GitBranch className="h-6 w-6" strokeWidth={2} />
              </Badge>
            </div>
            <div className="ml-4">
              <button className="inline-flex cursor-copy font-medium">
                <Copy className="mr-2 h-4 w-4" strokeWidth={2} />

                {props.row.original.name}
              </button>
              <div className="text-light">{props.row.original.description}</div>
            </div>
          </div>
        </td>
      ),
    }),
    columnHelper.display({
      id: "action",
      cell: (props) => (
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
          <Button secondary={true} small className="float-right border-lighter">
            Open pull request
          </Button>
        </td>
      ),
    }),
  ];

  const table = useReactTable({
    data: allBranches,
    columns,
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="inline-block min-w-full py-4 align-middle">
      <div className="overflow-hidden shadow ring-1 ring-darker ring-opacity-5 md:rounded">
        <div className="min-w-full rounded-t bg-darker pt-3">
          <Filters />
        </div>
        <table className="min-w-full divide-y divide-light">
          <tbody className="bg-dark">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row
                  .getVisibleCells()
                  .map((cell) =>
                    flexRender(cell.column.columnDef.cell, cell.getContext()),
                  )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
