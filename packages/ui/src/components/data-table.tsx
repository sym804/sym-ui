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
      className={cn(
        "w-full overflow-x-auto rounded-md border border-neutral-100 bg-white",
        "dark:border-[#2a2d3e] dark:bg-[#1e222d]",
        className,
      )}
    >
      <table className="w-full caption-bottom text-sm">
        <thead className="border-b border-neutral-100 bg-neutral-50 dark:border-[#2a2d3e] dark:bg-[#262a36]">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = enableSorting && header.column.getCanSort();
                return (
                  <th
                    key={header.id}
                    onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    className={cn(
                      "h-10 px-4 text-left align-middle font-medium text-neutral-500 dark:text-[#787b86]",
                      canSort && "cursor-pointer select-none",
                    )}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    {canSort ? (
                      <span className="ml-1 opacity-70">
                        {header.column.getIsSorted() === "asc" ? "▲" : header.column.getIsSorted() === "desc" ? "▼" : ""}
                      </span>
                    ) : null}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="h-24 text-center text-neutral-500 dark:text-[#787b86]"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-[#2a2d3e] dark:hover:bg-[#262a36]"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4 align-middle text-neutral-900 dark:text-[#d1d4dc]">
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
