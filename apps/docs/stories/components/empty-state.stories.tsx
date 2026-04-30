import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState, Button } from "@sym/ui";

const meta: Meta<typeof EmptyState> = {
  title: "Components/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  render: () => (
    <EmptyState
      title="결과가 없습니다"
      description="검색어 또는 필터를 변경해 다시 시도해보세요."
      action={<Button variant="outline">필터 초기화</Button>}
    />
  ),
};
