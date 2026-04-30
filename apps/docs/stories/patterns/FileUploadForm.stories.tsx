import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Info } from "lucide-react";
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
} from "@sym/ui";

const meta: Meta = {
  title: "Patterns/File Upload Form",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "파일 업로드 + 메타데이터 입력 + 정보 알림 + 액션 버튼 조합. 첨부 폼 / 자료 등록 패턴의 골격.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

const Demo = () => {
  const [files, setFiles] = React.useState<File[]>([]);

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-6 py-10">
      <Card>
        <CardHeader>
          <CardTitle>자료 등록</CardTitle>
          <CardDescription>고객사에 공유할 PDF / 이미지를 업로드합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <Alert>
            <Info aria-hidden className="absolute left-4 top-4 h-4 w-4" />
            <AlertTitle>업로드 전 확인</AlertTitle>
            <AlertDescription>
              50MB 이하의 PDF / PNG / JPG 만 등록할 수 있습니다. 외부 링크는 별도 폼에서 등록하세요.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input id="title" placeholder="예: 2026 Q2 출시 안내" />
          </div>

          <div className="space-y-2">
            <Label>첨부 파일</Label>
            <FileUpload
              multiple
              accept="application/pdf,image/*"
              ariaLabel="자료 파일 업로드"
              hint="PDF / PNG / JPG, 최대 50MB"
              onFiles={setFiles}
            />
            {files.length > 0 ? (
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
          <Button variant="outline">취소</Button>
          <Button disabled={files.length === 0}>등록</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export const Default: Story = { render: () => <Demo /> };
