import Link from "next/link";
import { Columns, Filter, Search } from "lucide-react";
import { BaseInput } from "@/components/theme";

type AuditLogTableProps = {
  auditLogs: any;
  setSlideOverOpen: (open: boolean) => void;
};

export default function AuditLogTable({
  auditLogs,
  setSlideOverOpen,
}: AuditLogTableProps) {
  return (
    <div className="border-dark mt-12 w-full overflow-x-auto rounded-md border-2 shadow-sm">
      <div className="flex items-center justify-end py-2 px-2 font-medium">
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
        <thead className="border-dark border-b-2">
          <tr>
            <th className="py-3 px-6 text-sm font-medium">Created By</th>
            <th className="py-3 px-6 text-sm font-normal">Action Performed</th>
            <th className="py-3 px-6 text-sm font-normal">Project</th>
            <th className="py-3 px-6 text-sm font-normal">Created At</th>
            <th className="py-3 px-6 text-sm"></th>
          </tr>
        </thead>
        <tbody className="divide-dark bg-darker divide-y">
          {auditLogs.map((item, idx) => (
            <tr key={idx}>
              <td className="flex items-center gap-x-3 whitespace-nowrap py-3 px-6">
                <img src={item.avatar} className="h-10 w-10 rounded-full" />
                <div>
                  <span className="block text-xs">{item.createdBy.name}</span>
                </div>
              </td>
              <td className="whitespace-nowrap rounded-md px-6 py-4">
                <span className="bg-lighter text-dark rounded-xl border px-2 py-0.5 text-xs tracking-tight">
                  {item.action}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                {item.project.name}
              </td>
              <td className="whitespace-nowrap px-6 py-4">{item.createdAt}</td>
              <td className="whitespace-nowrap px-6 text-right">
                <button
                  onClick={() => setSlideOverOpen(true)}
                  className="py-2 px-3 font-medium text-teal-400 duration-150 hover:text-teal-300 hover:underline"
                >
                  Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between py-2 px-2 font-medium">
        <p className="text-xs">100 items</p>
        <div className="flex items-center gap-4">
          <Link className="text-xs text-teal-400" href="/">
            Prev
          </Link>
          <div>
            <span className="block text-xs">Page 1 of 3</span>
          </div>
          <Link className="text-xs text-teal-400" href="/">
            Next
          </Link>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <p>Per Page</p>
          <select className="input-primary text-xs">
            <option>10</option>
            <option>20</option>
            <option>30</option>
            <option>40</option>
            <option>50</option>
          </select>
        </div>
      </div>
    </div>
  );
}