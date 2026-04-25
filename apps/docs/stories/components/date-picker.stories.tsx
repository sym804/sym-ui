import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "@sym/ui";
import React from "react";

const meta: Meta<typeof DatePicker> = { title: "Components/DatePicker", component: DatePicker, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Basic: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(undefined);
    return <DatePicker value={date} onChange={setDate} placeholder="생년월일" />;
  },
};

export const Prefilled: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 3, 25));
    return <DatePicker value={date} onChange={setDate} />;
  },
};
