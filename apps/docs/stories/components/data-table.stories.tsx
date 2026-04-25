import type { Meta, StoryObj } from "@storybook/react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@sym/ui";

type Invoice = { id: string; customer: string; amount: number; status: "paid" | "pending" | "failed" };

const columns: ColumnDef<Invoice>[] = [
  { accessorKey: "id", header: "Invoice" },
  { accessorKey: "customer", header: "Customer" },
  { accessorKey: "amount", header: "Amount", cell: ({ getValue }) => `₩ ${(getValue<number>()).toLocaleString()}` },
  { accessorKey: "status", header: "Status" },
];

const data: Invoice[] = [
  { id: "INV-001", customer: "서영민", amount: 320000, status: "paid" },
  { id: "INV-002", customer: "박혜경", amount: 125000, status: "pending" },
  { id: "INV-003", customer: "김민수", amount: 480000, status: "failed" },
];

const meta: Meta<typeof DataTable> = { title: "Components/DataTable", component: DataTable as never, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof DataTable>;

export const Basic: Story = {
  render: () => <DataTable columns={columns} data={data} />,
};

export const Sortable: Story = {
  render: () => <DataTable columns={columns} data={data} enableSorting />,
};

export const Empty: Story = {
  render: () => <DataTable columns={columns} data={[]} emptyText="데이터가 없습니다" />,
};
