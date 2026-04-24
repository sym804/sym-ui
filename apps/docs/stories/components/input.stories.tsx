import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@sym/ui";

const meta: Meta<typeof Input> = {
  title: "Components/Input", component: Input, tags: ["autodocs"],
  args: { placeholder: "이메일 입력" },
};
export default meta;
type Story = StoryObj<typeof Input>;
export const Default: Story = {};
export const Error: Story = {
  render: (args) => <Input {...args} data-error defaultValue="invalid@" />,
};
export const Disabled: Story = { args: { disabled: true, placeholder: "입력 불가" } };
