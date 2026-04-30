import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { AlertCircle } from "lucide-react";
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
  Skeleton,
  Alert,
  AlertTitle,
  AlertDescription,
} from "@sym/ui";

const meta: Meta = {
  title: "Patterns/Settings Page",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Tabs + Form + Card + Switch + Select 가 함께 놓였을 때의 리듬. Default / Loading / Error / Mobile 변형.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

interface SettingsLayoutProps {
  loading?: boolean;
  error?: string;
}

const SettingsLayout = ({ loading, error }: SettingsLayoutProps) => {
  const [notifyEmail, setNotifyEmail] = React.useState(true);
  const [notifyPush, setNotifyPush] = React.useState(false);

  return (
    // v0.6.0: 페이지 외곽을 surface-subtle 로 깔아 카드(bg-surface)와 layer 분리.
    <div className="bg-surface-subtle min-h-screen">
      <div className="mx-auto max-w-3xl space-y-6 px-6 py-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">계정 설정</h1>
          <p className="text-sm text-muted-foreground">
            프로필, 알림, 보안 옵션을 관리합니다.
            {/* v0.6.0: 페이지 안의 보조 link 에 accent-brand 사용 (primary CTA 가 아닌
                brand 시그니처). */}
            <a
              href="#billing"
              className="ml-2 text-accent-brand underline underline-offset-4 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
            >
              구독 관리
            </a>
          </p>
        </div>
        <Badge variant="primary">Pro</Badge>
      </header>

      {error ? (
        <Alert variant="destructive">
          <AlertCircle aria-hidden className="absolute left-4 top-4 h-4 w-4" />
          <AlertTitle>저장하지 못했습니다</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

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
              {loading ? (
                <>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input id="name" defaultValue="홍길동" disabled={!!error} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input id="email" type="email" defaultValue="hong@example.com" disabled={!!error} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lang">언어</Label>
                    <Select defaultValue="ko" disabled={!!error}>
                      <SelectTrigger id="lang" aria-label="언어">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ko">한국어</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ja">日本語</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" disabled={loading}>취소</Button>
              <Button disabled={loading || !!error}>저장</Button>
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
    </div>
  );
};

export const Default: Story = { render: () => <SettingsLayout /> };

export const Loading: Story = {
  parameters: {
    docs: { description: { story: "초기 데이터 로딩 중. Skeleton 으로 레이아웃을 보존해 깜빡임 방지." } },
  },
  render: () => <SettingsLayout loading />,
};

export const ErrorState: Story = {
  parameters: {
    docs: { description: { story: "저장 실패 시 Alert(destructive) + 입력/액션 비활성." } },
  },
  render: () => (
    <SettingsLayout error="네트워크 연결이 끊어졌습니다. 잠시 후 다시 시도하세요." />
  ),
};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
    docs: { description: { story: "좁은 viewport 에서의 카드/탭 폭 변화." } },
  },
  render: () => <SettingsLayout />,
};

export const Dark: Story = {
  parameters: {
    themes: { themeOverride: "dark" },
    docs: { description: { story: "다크 모드에서 동일 화면. surface / border 대비 + Tabs underline 가시성 검토." } },
  },
  decorators: [
    (StoryFn) => (
      <div className="dark min-h-screen bg-background text-foreground">
        <StoryFn />
      </div>
    ),
  ],
  render: () => <SettingsLayout />,
};
