import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Label,
  Input,
  Switch,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Button,
  Separator,
  Badge,
} from "@sym/ui";

const meta: Meta = {
  title: "Patterns/Settings Page",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Tabs + Form + Card + Switch + Select 가 함께 놓였을 때의 리듬. 실제 앱의 Settings 페이지 골격.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

const SettingsLayout = () => {
  const [notifyEmail, setNotifyEmail] = React.useState(true);
  const [notifyPush, setNotifyPush] = React.useState(false);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">계정 설정</h1>
          <p className="text-sm text-muted-foreground">프로필, 알림, 보안 옵션을 관리합니다.</p>
        </div>
        <Badge variant="primary">Pro</Badge>
      </header>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">프로필</TabsTrigger>
          <TabsTrigger value="notifications">알림</TabsTrigger>
          <TabsTrigger value="security">보안</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>프로필 정보</CardTitle>
              <CardDescription>다른 사용자에게 보이는 공개 정보입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input id="name" defaultValue="홍길동" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input id="email" type="email" defaultValue="hong@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lang">언어</Label>
                <Select defaultValue="ko">
                  <SelectTrigger id="lang">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ko">한국어</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">취소</Button>
              <Button>저장</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>알림</CardTitle>
              <CardDescription>채널별로 켜고 끌 수 있습니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="n-email">이메일 알림</Label>
                  <p className="text-xs text-muted-foreground">중요한 변경사항을 메일로 받습니다.</p>
                </div>
                <Switch id="n-email" checked={notifyEmail} onCheckedChange={setNotifyEmail} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="n-push">푸시 알림</Label>
                  <p className="text-xs text-muted-foreground">모바일/데스크탑 앱으로 즉시 알림.</p>
                </div>
                <Switch id="n-push" checked={notifyPush} onCheckedChange={setNotifyPush} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>보안</CardTitle>
              <CardDescription>비밀번호와 2단계 인증을 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>마지막 로그인 2 시간 전 · IP 192.168.1.42</p>
              <p>2단계 인증 활성 (Authenticator)</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline">비밀번호 변경</Button>
              <Button variant="destructive">로그아웃</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const Default: Story = { render: () => <SettingsLayout /> };
