import type { Meta, StoryObj } from "@storybook/react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, Button } from "@sym/ui";

const meta: Meta = { title: "Components/DropdownMenu", tags: ["autodocs"] };
export default meta;
type Story = StoryObj;
export const Basic: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="outline">Menu</Button></DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>내 계정</DropdownMenuLabel>
        <DropdownMenuItem>프로필</DropdownMenuItem>
        <DropdownMenuItem>설정</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>로그아웃</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
