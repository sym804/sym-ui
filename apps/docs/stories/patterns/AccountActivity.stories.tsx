import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
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
} from "@sym/ui";

const meta: Meta = {
  title: "Patterns/Account Activity",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "온보딩 / 신청 진행 상태 + 최근 활동 로그가 함께 놓일 때의 패턴. Stepper + Card + Badge + Separator.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

const Demo = () => {
  const [step, setStep] = React.useState(2);

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-6 py-10">
      <Card>
        <CardHeader>
          <CardTitle>온보딩 진행 상황</CardTitle>
          <CardDescription>모든 단계를 마치면 모든 기능을 사용할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
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
          <Button onClick={() => setStep((s) => Math.min(4, s + 1))}>
            다음 단계
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>최근 활동</CardTitle>
          <CardDescription>지난 7 일 동안의 변경 사항입니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {[
            { who: "홍길동", what: "결제 수단을 추가했습니다", when: "2시간 전", tag: "billing" },
            { who: "관리자", what: "팀에 김소이 (소프트웨어 엔지니어) 를 초대했습니다", when: "어제", tag: "team" },
            { who: "홍길동", what: "프로필 이름을 변경했습니다", when: "3일 전", tag: "profile" },
          ].map((item, i, arr) => (
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

export const Default: Story = { render: () => <Demo /> };
