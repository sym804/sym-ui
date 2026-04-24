import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@sym/ui";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Button" },
};
export default meta;
type Story = StoryObj<typeof Button>;
export const Primary: Story = { args: { variant: "primary" } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Outline: Story = { args: { variant: "outline" } };
export const Ghost: Story = { args: { variant: "ghost" } };
export const Destructive: Story = { args: { variant: "destructive", children: "Delete" } };
export const Small: Story = { args: { size: "sm", children: "Small" } };
export const Large: Story = { args: { size: "lg", children: "Large" } };
export const Icon: Story = { args: { size: "icon", children: "+" } };
export const Disabled: Story = { args: { disabled: true } };
