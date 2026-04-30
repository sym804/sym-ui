import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { NumberInput } from "@sym/ui";

const meta: Meta<typeof NumberInput> = {
  title: "Components/NumberInput",
  component: NumberInput,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof NumberInput>;

const Demo = () => {
  const [value, setValue] = React.useState<number | null>(3);
  return <NumberInput value={value ?? undefined} onChange={setValue} min={0} max={10} step={1} />;
};

export const Default: Story = { render: () => <Demo /> };
export const WithBounds: Story = {
  render: () => <NumberInput defaultValue={5} min={0} max={10} step={1} />,
};
