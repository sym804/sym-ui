import type { Meta, StoryObj } from "@storybook/react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Button,
} from "@sym/ui";

const meta: Meta<typeof Sheet> = { title: "Components/Sheet", component: Sheet, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof Sheet>;

export const RightSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open sheet</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>프로필 편집</SheetTitle>
          <SheetDescription>변경 사항은 자동 저장됩니다.</SheetDescription>
        </SheetHeader>
        <div className="mt-4 text-sm text-neutral-600 dark:text-[#a3a6af]">폼 영역 플레이스홀더</div>
      </SheetContent>
    </Sheet>
  ),
};
