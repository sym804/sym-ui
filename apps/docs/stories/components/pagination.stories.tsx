import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@sym/ui";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Pagination>;

const Demo = () => {
  const [page, setPage] = React.useState(2);
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} />
        </PaginationItem>
        {[1, 2, 3].map((p) => (
          <PaginationItem key={p}>
            <PaginationLink isActive={page === p} onClick={() => setPage(p)}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink onClick={() => setPage(10)}>10</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext onClick={() => setPage((p) => p + 1)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export const Default: Story = { render: () => <Demo /> };
