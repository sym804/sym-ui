import type { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "@sym/ui";
import * as React from "react";

const meta: Meta<typeof Calendar> = { title: "Components/Calendar", component: Calendar, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof Calendar>;

function CalendarSingleDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <div className="rounded-md border border-border p-2">
      <Calendar mode="single" selected={date} onSelect={setDate} />
    </div>
  );
}

export const Single: Story = {
  render: () => <CalendarSingleDemo />,
};
