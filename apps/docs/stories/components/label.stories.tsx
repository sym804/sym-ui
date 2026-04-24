import type { Meta, StoryObj } from "@storybook/react";
import { Label, Input } from "@sym/ui";

const meta: Meta<typeof Label> = { title: "Components/Label", component: Label, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof Label>;
export const Default: Story = {
  render: () => (
    <div>
      <Label htmlFor="email">이메일</Label>
      <Input id="email" placeholder="name@company.com" />
    </div>
  ),
};
export const Required: Story = {
  render: () => (
    <div>
      <Label htmlFor="name" required>닉네임</Label>
      <Input id="name" placeholder="2~12자" />
    </div>
  ),
};
