import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  FileUpload,
  Label,
  Input,
  Alert,
  AlertTitle,
  AlertDescription,
  Button,
  Badge,
  Progress,
} from "@sym/ui";

const meta: Meta = {
  title: "Patterns/File Upload Form",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "파일 업로드 + 메타데이터 + 정보 알림 + 액션 조합. Default / Uploading / ValidationError / Success.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

interface DemoProps {
  uploading?: number;
  errorMessage?: string;
  success?: boolean;
}

const Demo = ({ uploading, errorMessage, success }: DemoProps) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const isUploading = typeof uploading === "number";

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-6 py-10">
      <Card>
        <CardHeader>
          <CardTitle>자료 등록</CardTitle>
          <CardDescription>고객사에 공유할 PDF / 이미지를 업로드합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {success ? (
            <Alert variant="success">
              <CheckCircle2 aria-hidden className="absolute left-4 top-4 h-4 w-4" />
              <AlertTitle>등록 완료</AlertTitle>
              <AlertDescription>자료가 정상 등록되었습니다. 잠시 후 목록에서 확인할 수 있습니다.</AlertDescription>
            </Alert>
          ) : errorMessage ? (
            <Alert variant="destructive">
              <AlertTriangle aria-hidden className="absolute left-4 top-4 h-4 w-4" />
              <AlertTitle>등록할 수 없습니다</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <Info aria-hidden className="absolute left-4 top-4 h-4 w-4" />
              <AlertTitle>업로드 전 확인</AlertTitle>
              <AlertDescription>
                50MB 이하의 PDF / PNG / JPG 만 등록할 수 있습니다.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input id="title" placeholder="예: 2026 Q2 출시 안내" disabled={isUploading || success} />
          </div>

          <div className="space-y-2">
            <Label>첨부 파일</Label>
            <FileUpload
              multiple
              accept="application/pdf,image/*"
              ariaLabel="자료 파일 업로드"
              hint="PDF / PNG / JPG, 최대 50MB"
              disabled={isUploading || success}
              onFiles={setFiles}
            />
            {isUploading ? (
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>업로드 중...</span>
                  <span>{uploading}%</span>
                </div>
                <Progress value={uploading} aria-label="업로드 진행률" />
              </div>
            ) : null}
            {!isUploading && files.length > 0 ? (
              <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
                {files.map((f) => (
                  <li key={f.name} className="flex items-center gap-2">
                    <Badge variant="neutral">{(f.size / 1024).toFixed(1)} KB</Badge>
                    <span className="truncate">{f.name}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" disabled={isUploading}>취소</Button>
          <Button disabled={isUploading || success || (!errorMessage && files.length === 0)}>
            {isUploading ? "업로드 중" : success ? "완료" : "등록"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export const Default: Story = { render: () => <Demo /> };

export const Uploading: Story = {
  parameters: {
    docs: { description: { story: "업로드 진행 중. Progress + 입력/버튼 비활성." } },
  },
  render: () => <Demo uploading={62} />,
};

export const ValidationError: Story = {
  parameters: {
    docs: { description: { story: "파일 크기/형식 위반. Alert(destructive) 로 즉시 안내." } },
  },
  render: () => <Demo errorMessage="첨부한 'report.zip' 파일이 50MB 를 초과합니다 (62.4MB). PDF 또는 이미지로 다시 시도하세요." />,
};

export const Success: Story = {
  parameters: {
    docs: { description: { story: "등록 완료. Alert(success) + 폼 잠금." } },
  },
  render: () => <Demo success />,
};

export const Dark: Story = {
  parameters: {
    themes: { themeOverride: "dark" },
    docs: { description: { story: "다크 모드에서 Alert (info / success / destructive) 색상 가시성 + drop zone border 대비 검토." } },
  },
  decorators: [
    (StoryFn) => (
      <div className="dark min-h-screen bg-background text-foreground">
        <StoryFn />
      </div>
    ),
  ],
  render: () => <Demo />,
};
