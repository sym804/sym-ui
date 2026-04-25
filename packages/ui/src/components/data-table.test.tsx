import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";

type Person = { name: string; age: number };

const columns: ColumnDef<Person>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "age", header: "Age" },
];

const data: Person[] = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 },
];

describe("DataTable", () => {
  it("renders headers and rows", () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("renders empty state when data is []", () => {
    render(<DataTable columns={columns} data={[]} emptyText="결과 없음" />);
    expect(screen.getByText("결과 없음")).toBeInTheDocument();
  });
});
