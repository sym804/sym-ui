/**
 * @registry-meta
 * name: file-upload
 * dependencies: []
 * internalDeps: ["utils", "button"]
 *
 * 접근성: 드롭존이 button role 로 노출되어 키보드 (Enter/Space) 로 파일 선택 가능.
 * 내부 "파일 선택" 어포던스는 시각적 표시일 뿐이라 실제 native button 을 중첩하지 않고
 * span 으로 렌더한다 (button-in-button 회피, 단일 키보드 진입점 유지).
 */
import * as React from "react";
import { cn } from "../lib/utils";
import { buttonVariants } from "./button";

export interface FileUploadProps {
  className?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  hint?: React.ReactNode;
  onFiles?: (files: File[]) => void;
}

export const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  ({ className, accept, multiple, disabled, ariaLabel = "Upload file", hint, onFiles }, ref) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      },
      [ref],
    );
    const [dragOver, setDragOver] = React.useState(false);
    const hintId = React.useId();

    const open = () => inputRef.current?.click();

    const handleFiles = (list: FileList | null) => {
      if (!list || list.length === 0) return;
      onFiles?.(Array.from(list));
    };

    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label={ariaLabel}
          aria-describedby={hint ? hintId : undefined}
          aria-disabled={disabled || undefined}
          onClick={() => !disabled && open()}
          onKeyDown={(e) => {
            if (disabled) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              open();
            }
          }}
          onDragOver={(e) => {
            if (disabled) return;
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            if (disabled) return;
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border bg-surface px-6 py-10 text-center text-sm transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            dragOver && "border-primary bg-primary/5",
            disabled && "pointer-events-none opacity-60",
          )}
        >
          <span aria-hidden className="text-2xl text-muted-foreground">⬆</span>
          <span className="font-medium text-foreground">파일을 끌어다 놓거나 클릭하세요</span>
          <span
            aria-hidden
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "pointer-events-none")}
          >
            파일 선택
          </span>
        </div>
        {hint ? (
          <p id={hintId} className="text-xs text-muted-foreground">
            {hint}
          </p>
        ) : null}
        <input
          ref={setRefs}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    );
  },
);
FileUpload.displayName = "FileUpload";
