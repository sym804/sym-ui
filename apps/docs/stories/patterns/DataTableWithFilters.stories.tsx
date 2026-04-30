import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Search } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Combobox,
  Badge,
  DataTable,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  EmptyState,
  Button,
  Skeleton,
} from "@sym/ui";

const meta: Meta = {
  title: "Patterns/DataTable with Filters",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "데이터 테이블 + 검색 + 상태 필터 + 페이지네이션 + 빈 상태. Default / Loading / Empty / Mobile.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

interface Order {
  id: string;
  customer: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  date: string;
}

const SAMPLE: Order[] = [
  { id: "1001", customer: "ACME 코퍼레이션", amount: 124000, status: "paid", date: "2026-04-22" },
  { id: "1002", customer: "Globex", amount: 87500, status: "pending", date: "2026-04-23" },
  { id: "1003", customer: "Initech", amount: 320500, status: "paid", date: "2026-04-23" },
  { id: "1004", customer: "Soylent Corp", amount: 56000, status: "failed", date: "2026-04-24" },
  { id: "1005", customer: "Hooli", amount: 215000, status: "paid", date: "2026-04-25" },
  { id: "1006", customer: "Pied Piper", amount: 41000, status: "pending", date: "2026-04-25" },
];

const STATUS_LABEL: Record<Order["status"], string> = {
  paid: "결제 완료",
  pending: "대기",
  failed: "실패",
};
const STATUS_VARIANT: Record<Order["status"], "success" | "warning" | "danger"> = {
  paid: "success",
  pending: "warning",
  failed: "danger",
};

const columns: ColumnDef<Order>[] = [
  { accessorKey: "id", header: "주문 ID" },
  { accessorKey: "customer", header: "고객사" },
  {
    accessorKey: "amount",
    header: "금액",
    cell: (ctx) => `₩${ctx.getValue<number>().toLocaleString("ko-KR")}`,
  },
  {
    accessorKey: "status",
    header: "상태",
    cell: (ctx) => {
      const v = ctx.getValue<Order["status"]>();
      return <Badge variant={STATUS_VARIANT[v]}>{STATUS_LABEL[v]}</Badge>;
    },
  },
  { accessorKey: "date", header: "날짜" },
];

interface DemoProps {
  initialQuery?: string;
  initialStatus?: string;
  loading?: boolean;
}

const Demo = ({ initialQuery = "", initialStatus = "all", loading }: DemoProps) => {
  const [query, setQuery] = React.useState(initialQuery);
  const [status, setStatus] = React.useState<string>(initialStatus);
  const [page, setPage] = React.useState(1);

  const filtered = SAMPLE.filter((row) => {
    if (status !== "all" && row.status !== status) return false;
    if (query.trim() && !row.customer.includes(query) && !row.id.includes(query)) return false;
    return true;
  });

  return (
    // v0.6.0: 페이지 외곽을 surface-subtle 로 깔아 카드와 layer 분리.
    <div className="bg-surface-subtle min-h-screen">
    <div className="mx-auto max-w-5xl space-y-4 px-6 py-10">
      <Card>
        <CardHeader>
          <CardTitle>주문 목록</CardTitle>
          <CardDescription>최근 30 일 동안의 주문을 확인합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-72">
              <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="주문 검색"
                placeholder="고객사 또는 주문 ID"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
                disabled={loading}
              />
            </div>
            <Combobox
              value={status}
              onValueChange={setStatus}
              disabled={loading}
              options={[
                { value: "all", label: "전체 상태" },
                { value: "paid", label: "결제 완료" },
                { value: "pending", label: "대기" },
                { value: "failed", label: "실패" },
              ]}
            />
          </div>

          {loading ? (
            <div className="space-y-3 rounded-md border border-border p-4">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="grid grid-cols-5 gap-3">
                  <Skeleton className="h-4" />
                  <Skeleton className="h-4 col-span-2" />
                  <Skeleton className="h-4" />
                  <Skeleton className="h-4" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              title="조건에 맞는 주문이 없습니다"
              description="검색어와 필터를 조정해 다시 시도해보세요."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery("");
                    setStatus("all");
                  }}
                >
                  필터 초기화
                </Button>
              }
            />
          ) : (
            <DataTable columns={columns} data={filtered} enableSorting />
          )}

          {!loading && filtered.length > 0 ? (
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
                  <PaginationNext onClick={() => setPage((p) => p + 1)} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          ) : null}
        </CardContent>
      </Card>
    </div>
    </div>
  );
};

export const Default: Story = { render: () => <Demo /> };

export const Loading: Story = {
  parameters: {
    docs: { description: { story: "데이터 fetch 중. Skeleton 5 줄로 그리드 보존." } },
  },
  render: () => <Demo loading />,
};

export const Empty: Story = {
  parameters: {
    docs: { description: { story: "필터/검색으로 0 hit. EmptyState + 필터 초기화 버튼." } },
  },
  render: () => <Demo initialQuery="존재하지 않는 고객사" initialStatus="failed" />,
};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
    docs: { description: { story: "좁은 viewport. 컬럼은 가로 스크롤로 처리, 검색/필터는 세로 스택." } },
  },
  render: () => <Demo />,
};

export const Dark: Story = {
  parameters: {
    themes: { themeOverride: "dark" },
    docs: { description: { story: "다크 모드에서 테이블 row hover, 정렬 헤더 focus ring, Badge status 색상 검토." } },
  },
  decorators: [
    (StoryFn) => (
      <div className="dark min-h-screen bg-background text-foreground">
        <StoryFn />
      </div>
    ),
  ],
  render: () => <Demo />,
};
