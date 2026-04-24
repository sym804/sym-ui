import type { Meta, StoryObj } from "@storybook/react";
import { Switch, Label } from "@sym/ui";

const meta: Meta<typeof Switch> = { title: "Components/Switch", component: Switch, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof Switch>;
export const Basic: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Switch id="notif" />
      <Label htmlFor="notif" className="mb-0">알림 받기</Label>
    </div>
  ),
};
