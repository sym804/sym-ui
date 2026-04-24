import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge } from "@sym/ui";

const meta: Meta<typeof Card> = { title: "Components/Card", component: Card, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof Card>;
export const Full: Story = {
  render: () => (
    <Card className="w-[320px]">
      <CardHeader>
        <CardTitle>이번 달 매출</CardTitle>
        <CardDescription>지난달 대비 +12% 상승</CardDescription>
      </CardHeader>
      <CardContent><div className="text-2xl font-extrabold">₩ 4,280,000</div></CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm">닫기</Button>
        <Button size="sm">열기</Button>
      </CardFooter>
    </Card>
  ),
};
export const WithBadge: Story = {
  render: () => (
    <Card className="w-[320px]">
      <Badge className="mb-2">NEW</Badge>
      <CardTitle>시스템 공지</CardTitle>
      <CardDescription>새 기능이 추가되었습니다.</CardDescription>
    </Card>
  ),
};
