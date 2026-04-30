import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "@sym/ui";

const meta: Meta<typeof Slider> = {
  title: "Components/Slider",
  component: Slider,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: { defaultValue: [40], max: 100, step: 1, "aria-label": "Volume" },
  render: (args) => (
    <div className="w-64">
      <Slider {...args} />
    </div>
  ),
};

export const Range: Story = {
  args: {
    defaultValue: [20, 80],
    max: 100,
    step: 1,
    "aria-label": "Range",
    thumbAriaLabels: ["Min", "Max"],
  },
  render: (args) => (
    <div className="w-64">
      <Slider {...args} />
    </div>
  ),
};
