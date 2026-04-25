import type { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "@sym/ui";
import React from "react";

const meta: Meta<typeof Calendar> = { title: "Components/Calendar", component: Calendar, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof Calendar>;

export const Single: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <div className="rounded-md border border-neutral-100 p-2 dark:border-[#2a2d3e]">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </div>
    );
  },
};
