import type { Meta, StoryObj } from "@storybook/react";
import { Popover, PopoverTrigger, PopoverContent, Button } from "@sym/ui";

const meta: Meta<typeof Popover> = { title: "Components/Popover", component: Popover, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof Popover>;

export const Basic: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="text-sm">이 팝오버는 Radix 기반이며 화살표로 닫을 수 있습니다.</p>
      </PopoverContent>
    </Popover>
  ),
};
