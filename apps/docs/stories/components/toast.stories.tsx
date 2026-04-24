import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Toast, ToastTitle, ToastDescription, ToastProvider, ToastViewport, Button } from "@sym/ui";

const meta: Meta = { title: "Components/Toast", tags: ["autodocs"] };
export default meta;
type Story = StoryObj;
export const Success: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <ToastProvider swipeDirection="right">
        <Button onClick={() => { setOpen(false); setOpen(true); }}>Show toast</Button>
        <Toast open={open} onOpenChange={setOpen} variant="success">
          <ToastTitle>저장되었습니다</ToastTitle>
          <ToastDescription>변경 사항이 자동 동기화됩니다.</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
  },
};
