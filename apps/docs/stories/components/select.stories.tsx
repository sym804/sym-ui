import type { Meta, StoryObj } from "@storybook/react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@sym/ui";

const meta: Meta = { title: "Components/Select", tags: ["autodocs"] };
export default meta;
type Story = StoryObj;
export const Basic: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[240px]" aria-label="Framework">
        <SelectValue placeholder="프레임워크 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="react">React</SelectItem>
        <SelectItem value="vue">Vue</SelectItem>
        <SelectItem value="svelte">Svelte</SelectItem>
      </SelectContent>
    </Select>
  ),
};
