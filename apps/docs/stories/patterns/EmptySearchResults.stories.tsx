import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Search, FilterX } from "lucide-react";
import { Input, Button, EmptyState, Card, CardContent } from "@sym/ui";

const meta: Meta = {
  title: "Patterns/Empty Search Results",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "검색 결과가 없을 때의 빈 상태. 검색 입력 + 결과 영역 + EmptyState + 액션 버튼.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

const Demo = () => {
  const [query, setQuery] = React.useState("스토리북에 없는 키워드");

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

      <Card>
        <CardContent className="px-0 py-0">
          <EmptyState
            icon={<Search aria-hidden />}
            title={`"${query}" 에 대한 결과가 없습니다`}
            description="키워드 철자를 확인하거나 더 일반적인 단어로 다시 검색해보세요. 필터를 사용 중이라면 초기화도 도움이 됩니다."
            action={
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setQuery("")}>
                  <FilterX aria-hidden className="mr-1.5 h-4 w-4" /> 검색어 비우기
                </Button>
                <Button>새로 검색</Button>
              </div>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
};

export const Default: Story = { render: () => <Demo /> };
