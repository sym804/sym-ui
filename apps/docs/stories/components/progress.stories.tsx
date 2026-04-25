import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "@sym/ui";

const meta: Meta<typeof Progress> = { title: "Components/Progress", component: Progress, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof Progress>;

export const Values: Story = {
  render: () => (
    <div className="w-[320px] space-y-3">
      <Progress value={25} />
      <Progress value={50} />
      <Progress value={75} />
      <Progress value={100} />
    </div>
  ),
};

export const Indeterminate: Story = {
  render: () => (
    <div className="w-[320px]">
      <Progress value={null} />
    </div>
  ),
};
