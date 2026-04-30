import type { Meta, StoryObj } from "@storybook/react";
import { Stepper, StepperItem } from "@sym/ui";

const meta: Meta<typeof Stepper> = {
  title: "Components/Stepper",
  component: Stepper,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Stepper>;

export const Horizontal: Story = {
  render: () => (
    <Stepper value={1}>
      <StepperItem label="계정" description="이메일 입력" />
      <StepperItem label="프로필" description="기본 정보" />
      <StepperItem label="확인" description="완료" />
    </Stepper>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Stepper orientation="vertical" value={2}>
      <StepperItem label="신청" />
      <StepperItem label="검토" />
      <StepperItem label="승인" />
      <StepperItem label="배포" />
    </Stepper>
  ),
};
