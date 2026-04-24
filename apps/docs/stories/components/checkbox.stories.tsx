import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox, Label } from "@sym/ui";

const meta: Meta<typeof Checkbox> = { title: "Components/Checkbox", component: Checkbox, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof Checkbox>;
export const Basic: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms" className="mb-0">이용약관에 동의</Label>
    </div>
  ),
};
export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="d" disabled />
      <Label htmlFor="d" className="mb-0">비활성</Label>
    </div>
  ),
};
