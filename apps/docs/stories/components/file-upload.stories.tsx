import type { Meta, StoryObj } from "@storybook/react";
import { FileUpload } from "@sym/ui";

const meta: Meta<typeof FileUpload> = {
  title: "Components/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
  render: () => (
    <div className="w-96">
      <FileUpload
        accept="image/*"
        ariaLabel="이미지 업로드"
        hint="JPG, PNG. 최대 5MB."
        onFiles={(files) => console.log(files)}
      />
    </div>
  ),
};

export const Multiple: Story = {
  render: () => (
    <div className="w-96">
      <FileUpload
        multiple
        ariaLabel="첨부 파일 업로드"
        hint="여러 파일을 한 번에 업로드할 수 있습니다."
        onFiles={(files) => console.log(files)}
      />
    </div>
  ),
};
