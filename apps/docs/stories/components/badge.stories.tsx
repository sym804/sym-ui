import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@sym/ui";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge", component: Badge, tags: ["autodocs"],
  args: { children: "NEW" },
};
export default meta;
type Story = StoryObj<typeof Badge>;
export const Primary: Story = { args: { variant: "primary" } };
export const Neutral: Story = { args: { variant: "neutral", children: "Draft" } };
export const Success: Story = { args: { variant: "success", children: "Active" } };
export const Warning: Story = { args: { variant: "warning", children: "Pending" } };
export const Danger: Story = { args: { variant: "danger", children: "Failed" } };
export const Outline: Story = { args: { variant: "outline", children: "Archived" } };
