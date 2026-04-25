import type { Meta, StoryObj } from "@storybook/react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@sym/ui";

const meta: Meta<typeof Accordion> = { title: "Components/Accordion", component: Accordion, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof Accordion>;

export const Single: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[360px]">
      <AccordionItem value="payment">
        <AccordionTrigger>결제 방법</AccordionTrigger>
        <AccordionContent>신용카드, 계좌이체, 카카오페이 모두 지원합니다.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="refund">
        <AccordionTrigger>환불 정책</AccordionTrigger>
        <AccordionContent>구매 후 7일 이내 전액 환불됩니다.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
