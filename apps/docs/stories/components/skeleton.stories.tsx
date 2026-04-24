import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "@sym/ui";

const meta: Meta<typeof Skeleton> = { title: "Components/Skeleton", component: Skeleton, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof Skeleton>;
export const TextLines: Story = {
  render: () => (
    <div className="w-[360px] space-y-2">
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[360px]" />
      <Skeleton className="h-4 w-[300px]" />
    </div>
  ),
};
export const Card: Story = {
  render: () => (
    <div className="w-[320px] rounded-md border border-neutral-100 p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-3 w-[80px]" />
        </div>
      </div>
      <Skeleton className="h-24 w-full" />
    </div>
  ),
};
