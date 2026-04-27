/**
 * @registry-meta
 * name: data-table
 * dependencies: ["@tanstack/react-table"]
 * internalDeps: ["utils"]
 */
import * as React from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "../lib/utils";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyText?: string;
  className?: string;
  enableSorting?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  emptyText = "No results",
  className,
  enableSorting = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack returns non-memoizable functions; React Compiler skip is acceptable for this thin wrapper.
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(enableSorting
      ? { getSortedRowModel: getSortedRowModel(), onSortingChange: setSorting, state: { sorting } }
      : {}),
  });

  return (
    <div
      className={cn("w-full overflow-x-auto rounded-md border border-border bg-surface text-foreground", className)}
    >
      <table className="w-full caption-bottom text-sm">
        <thead className="border-b border-border bg-muted">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = enableSorting && header.column.getCanSort();
                const sortDir = header.column.getIsSorted();
                const ariaSort: "ascending" | "descending" | "none" | undefined = canSort
                  ? sortDir === "asc"
                    ? "ascending"
                    : sortDir === "desc"
                      ? "descending"
                      : "none"
                  : undefined;
                const sortHandler = header.column.getToggleSortingHandler();
                return (
                  <th
                    key={header.id}
                    scope="col"
                    aria-sort={ariaSort}
                    className="h-10 px-4 text-left align-middle font-medium text-muted-foreground"
                  >
                    {header.isPlaceholder ? null : canSort ? (
                      <button
                        type="button"
                        onClick={sortHandler}
                        className={cn(
                          "inline-flex items-center gap-1 -mx-1 rounded-sm px-1 py-0.5",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                          "hover:text-foreground",
                        )}
                      >
                        <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                        <span aria-hidden className="opacity-70">
                          {sortDir === "asc" ? "▲" : sortDir === "desc" ? "▼" : "↕"}
                        </span>
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                {emptyText}
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border transition-colors hover:bg-muted"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4 align-middle text-foreground">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
DataTable.displayName = "DataTable";
