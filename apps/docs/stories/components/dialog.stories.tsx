import type { Meta, StoryObj } from "@storybook/react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Button } from "@sym/ui";

const meta: Meta = { title: "Components/Dialog", tags: ["autodocs"] };
export default meta;
type Story = StoryObj;
export const Basic: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild><Button>Open dialog</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>이 작업은 되돌릴 수 없습니다.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost">취소</Button>
          <Button variant="destructive">삭제</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
