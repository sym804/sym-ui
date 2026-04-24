import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip, TooltipTrigger, TooltipContent, Button } from "@sym/ui";

const meta: Meta = { title: "Components/Tooltip", tags: ["autodocs"] };
export default meta;
type Story = StoryObj;
export const Basic: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild><Button variant="secondary">Hover me</Button></TooltipTrigger>
      <TooltipContent>이메일로 로그인</TooltipContent>
    </Tooltip>
  ),
};
