import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "@sym/ui";

const meta: Meta<typeof Separator> = {
  title: "Components/Separator",
  component: Separator,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-64 space-y-3">
      <p className="text-sm">위쪽 영역</p>
      <Separator />
      <p className="text-sm">아래쪽 영역</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-12 items-center gap-3 text-sm">
      <span>왼쪽</span>
      <Separator orientation="vertical" />
      <span>오른쪽</span>
    </div>
  ),
};
