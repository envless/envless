import { Dispatch, SetStateAction } from "react";
import { RowData, Table } from "@tanstack/react-table";
import { Search, X } from "lucide-react";

interface SearchInputProps<T extends RowData> {
  table: Table<T>;
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
}

export default function SearchInput<T extends RowData>({
  table,
  filter,
  setFilter,
}: SearchInputProps<T>) {
  const handleClearFilter = () => {
    table.setGlobalFilter("");
    setFilter("");
  };

  return (
    <div className="relative text-light focus-within:text-lighter">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-4 w-4" />
      </div>

      <input
        type="text"
        placeholder="Search"
        className="input-primary max-w-md py-1.5 !pl-9 text-sm"
        onChange={(e) => setFilter(String(e.target.value))}
        value={filter}
      />

      {table.getState().globalFilter !== "" && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button onClick={handleClearFilter} className="p-1">
            <X className="h-4 w-4 text-lighter" />
          </button>
        </div>
      )}
    </div>
  );
}
