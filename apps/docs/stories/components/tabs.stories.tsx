import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@sym/ui";

const meta: Meta<typeof Tabs> = { title: "Components/Tabs", component: Tabs, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof Tabs>;
export const Basic: Story = {
  render: () => (
    <Tabs defaultValue="profile" className="w-[360px]">
      <TabsList>
        <TabsTrigger value="profile">프로필</TabsTrigger>
        <TabsTrigger value="account">계정</TabsTrigger>
        <TabsTrigger value="security">보안</TabsTrigger>
      </TabsList>
      <TabsContent value="profile" className="p-4 rounded-md border border-neutral-100">
        프로필 정보를 수정할 수 있습니다.
      </TabsContent>
      <TabsContent value="account" className="p-4 rounded-md border border-neutral-100">
        계정 설정.
      </TabsContent>
      <TabsContent value="security" className="p-4 rounded-md border border-neutral-100">
        비밀번호 변경, 2FA.
      </TabsContent>
    </Tabs>
  ),
};
