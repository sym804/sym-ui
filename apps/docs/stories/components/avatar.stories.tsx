import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarImage, AvatarFallback } from "@sym/ui";

const meta: Meta<typeof Avatar> = { title: "Components/Avatar", component: Avatar, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof Avatar>;
export const Initials: Story = {
  render: () => <Avatar><AvatarFallback>SY</AvatarFallback></Avatar>,
};
export const Image: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/80?img=12" alt="user" />
      <AvatarFallback>U</AvatarFallback>
    </Avatar>
  ),
};
export const Stack: Story = {
  render: () => (
    <div className="flex -space-x-2">
      <Avatar className="ring-2 ring-white"><AvatarFallback>SY</AvatarFallback></Avatar>
      <Avatar className="ring-2 ring-white"><AvatarFallback>KH</AvatarFallback></Avatar>
      <Avatar className="ring-2 ring-white bg-neutral-200">
        <AvatarFallback className="bg-neutral-200 from-neutral-200 to-neutral-200 text-neutral-600">+5</AvatarFallback>
      </Avatar>
    </div>
  ),
};
