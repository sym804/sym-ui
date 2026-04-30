import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FileUpload } from "./file-upload";

describe("FileUpload", () => {
  it("exposes drop zone as button with aria-label", () => {
    render(<FileUpload ariaLabel="이미지 업로드" />);
    expect(screen.getByRole("button", { name: "이미지 업로드" })).toBeInTheDocument();
  });
  it("calls onFiles when files are selected", async () => {
    const onFiles = vi.fn();
    const { container } = render(<FileUpload onFiles={onFiles} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["hi"], "hi.txt", { type: "text/plain" });
    await userEvent.upload(input, file);
    expect(onFiles).toHaveBeenCalledOnce();
    expect(onFiles.mock.calls[0]?.[0]?.[0]?.name).toBe("hi.txt");
  });
});
