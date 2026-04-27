import type { Meta, StoryObj } from "@storybook/react";
import { Combobox } from "@sym/ui";
import * as React from "react";

const meta: Meta<typeof Combobox> = { title: "Components/Combobox", component: Combobox, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof Combobox>;

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "vite", label: "Vite" },
  { value: "nuxt", label: "Nuxt" },
];

function ComboboxSearchableDemo() {
  const [value, setValue] = React.useState<string | undefined>(undefined);
  return <Combobox options={frameworks} value={value} onValueChange={setValue} placeholder="프레임워크 선택" />;
}

export const Searchable: Story = {
  render: () => <ComboboxSearchableDemo />,
};
