import type { Meta, StoryObj } from "@storybook/react";
import { Alert, AlertTitle, AlertDescription } from "@sym/ui";

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  render: () => (
    <Alert>
      <AlertTitle>알림</AlertTitle>
      <AlertDescription>새 버전이 출시되었습니다.</AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  args: { variant: "success" },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>성공</AlertTitle>
      <AlertDescription>저장이 완료되었습니다.</AlertDescription>
    </Alert>
  ),
};

export const Warning: Story = {
  args: { variant: "warning" },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>주의</AlertTitle>
      <AlertDescription>곧 세션이 만료됩니다.</AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  args: { variant: "destructive" },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>오류</AlertTitle>
      <AlertDescription>요청을 처리하지 못했습니다.</AlertDescription>
    </Alert>
  ),
};
