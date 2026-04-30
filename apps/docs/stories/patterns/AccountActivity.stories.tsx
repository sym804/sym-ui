import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Stepper,
  StepperItem,
  Badge,
  Separator,
  Button,
  Alert,
  AlertTitle,
  AlertDescription,
} from "@sym/ui";

const meta: Meta = {
  title: "Patterns/Account Activity",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "온보딩 진행 + 최근 활동 로그. InProgress / Completed / Blocked 변형.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

interface DemoProps {
  initialStep?: number;
  blocked?: { atStep: number; message: string };
}

const ACTIVITIES = [
  { who: "홍길동", what: "결제 수단을 추가했습니다", when: "2시간 전", tag: "billing" },
  { who: "관리자", what: "팀에 김소이 (소프트웨어 엔지니어) 를 초대했습니다", when: "어제", tag: "team" },
  { who: "홍길동", what: "프로필 이름을 변경했습니다", when: "3일 전", tag: "profile" },
] as const;

const Demo = ({ initialStep = 2, blocked }: DemoProps) => {
  const [step, setStep] = React.useState(initialStep);
  const completed = step >= 4;

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-6 py-10">
      <Card>
        <CardHeader>
          <CardTitle>온보딩 진행 상황</CardTitle>
          <CardDescription>모든 단계를 마치면 모든 기능을 사용할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {completed ? (
            <Alert variant="success">
              <CheckCircle2 aria-hidden className="absolute left-4 top-4 h-4 w-4" />
              <AlertTitle>온보딩 완료</AlertTitle>
              <AlertDescription>모든 기능을 사용할 수 있습니다. 대시보드로 이동해 첫 워크스페이스를 만들어보세요.</AlertDescription>
            </Alert>
          ) : null}
          {blocked ? (
            <Alert variant="warning">
              <AlertTriangle aria-hidden className="absolute left-4 top-4 h-4 w-4" />
              <AlertTitle>{`'${["계정 생성", "프로필 설정", "결제 수단", "시작하기"][blocked.atStep]}' 단계가 진행되지 않습니다`}</AlertTitle>
              <AlertDescription>{blocked.message}</AlertDescription>
            </Alert>
          ) : null}
          <Stepper value={step}>
            <StepperItem label="계정 생성" description="이메일 인증 완료" />
            <StepperItem label="프로필 설정" description="이름과 사진" />
            <StepperItem label="결제 수단" description="카드 또는 계좌" />
            <StepperItem label="시작하기" description="대시보드로 이동" />
          </Stepper>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))}>
            이전
          </Button>
          {completed ? (
            <Button asChild>
              <a href="#dashboard">대시보드로 이동</a>
            </Button>
          ) : (
            <Button onClick={() => setStep((s) => Math.min(4, s + 1))}>다음 단계</Button>
          )}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>최근 활동</CardTitle>
          <CardDescription>지난 7 일 동안의 변경 사항입니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {ACTIVITIES.map((item, i, arr) => (
            <React.Fragment key={i}>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="text-foreground">
                    <span className="font-medium">{item.who}</span> 님이 {item.what}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.when}</p>
                </div>
                <Badge variant="neutral">{item.tag}</Badge>
              </div>
              {i < arr.length - 1 ? <Separator /> : null}
            </React.Fragment>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export const InProgress: Story = { render: () => <Demo initialStep={2} /> };

export const Completed: Story = {
  parameters: {
    docs: { description: { story: "모든 단계 완료. Alert(success) + CTA 버튼이 대시보드 링크로 변경." } },
  },
  render: () => <Demo initialStep={4} />,
};

export const Blocked: Story = {
  parameters: {
    docs: { description: { story: "특정 단계가 막힌 상태. Alert(warning) 로 도움말 안내." } },
  },
  render: () => (
    <Demo
      initialStep={2}
      blocked={{
        atStep: 2,
        message: "결제 카드 인증이 거부되었습니다. 다른 카드로 다시 시도하거나 고객센터에 문의해주세요.",
      }}
    />
  ),
};
