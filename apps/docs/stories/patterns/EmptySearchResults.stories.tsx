import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Search, FilterX } from "lucide-react";
import {
  Input,
  Button,
  EmptyState,
  Card,
  CardContent,
  Skeleton,
  Badge,
} from "@sym/ui";

const meta: Meta = {
  title: "Patterns/Empty Search Results",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "검색 결과가 없을 때의 빈 상태. Default / Loading / WithSuggestions 변형.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

const Demo = ({
  initialQuery,
  loading,
  suggestions,
}: {
  initialQuery?: string;
  loading?: boolean;
  suggestions?: string[];
}) => {
  const [query, setQuery] = React.useState(initialQuery ?? "스토리북에 없는 키워드");

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-6 py-10">
      <div className="relative">
        <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          aria-label="문서 검색"
          placeholder="문서 검색..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <Card>
          <CardContent className="space-y-3 py-6">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="px-0 py-0">
            <EmptyState
              icon={<Search aria-hidden />}
              title={`"${query}" 에 대한 결과가 없습니다`}
              description="키워드 철자를 확인하거나 더 일반적인 단어로 다시 검색해보세요."
              action={
                <div className="flex flex-col items-center gap-3">
                  {suggestions && suggestions.length > 0 ? (
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <span className="text-xs text-muted-foreground">이런 검색어는 어떨까요?</span>
                      {suggestions.map((s) => (
                        <Badge
                          key={s}
                          asChild
                          variant="outline"
                        >
                          <button
                            type="button"
                            onClick={() => setQuery(s)}
                            className="cursor-pointer hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                          >
                            {s}
                          </button>
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setQuery("")}>
                      <FilterX aria-hidden className="mr-1.5 h-4 w-4" /> 검색어 비우기
                    </Button>
                    <Button>새로 검색</Button>
                  </div>
                </div>
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export const Default: Story = { render: () => <Demo /> };

export const Loading: Story = {
  parameters: {
    docs: { description: { story: "검색 진행 중. Skeleton 4 줄로 결과 영역의 골격 유지." } },
  },
  render: () => <Demo loading />,
};

export const WithSuggestions: Story = {
  parameters: {
    docs: { description: { story: "결과 0 건일 때 추천 검색어 chips 노출. 클릭 시 query 자동 변경." } },
  },
  render: () => <Demo suggestions={["디자인 토큰", "다크 모드", "접근성", "shadcn"]} />,
};
