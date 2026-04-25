import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup, RadioGroupItem, Label } from "@sym/ui";

const meta: Meta<typeof RadioGroup> = { title: "Components/RadioGroup", component: RadioGroup, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Basic: Story = {
  render: () => (
    <RadioGroup defaultValue="starter" className="w-[240px]">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="starter" id="r1" />
        <Label htmlFor="r1">Starter</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="pro" id="r2" />
        <Label htmlFor="r2">Pro</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="enterprise" id="r3" />
        <Label htmlFor="r3">Enterprise</Label>
      </div>
    </RadioGroup>
  ),
};
