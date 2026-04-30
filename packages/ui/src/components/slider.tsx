/**
 * @registry-meta
 * name: slider
 * dependencies: ["@radix-ui/react-slider"]
 * internalDeps: ["utils"]
 *
 * defaultValue / value 의 길이만큼 thumb 가 렌더됩니다 (single / range 자동 지원).
 * 다중 thumb 일 때는 thumbAriaLabels 로 thumb 별 라벨을 지정하세요 (예: ["Min", "Max"]).
 */
import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../lib/utils";

export interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  thumbAriaLabels?: string[];
}

export const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, defaultValue, value, thumbAriaLabels, ...props }, ref) => {
  const thumbCount = (value ?? defaultValue ?? [0]).length;
  // 단일 thumb 일 때 root 의 aria-label 을 thumb 에 자동 fallback (axe 의
  // aria-input-field-name rule 대비). 다중 thumb 은 thumbAriaLabels 가 우선.
  const rootAriaLabel = (props as { "aria-label"?: string })["aria-label"];
  return (
    <SliderPrimitive.Root
      ref={ref}
      defaultValue={defaultValue}
      value={value}
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbCount }).map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          aria-label={thumbAriaLabels?.[i] ?? (thumbCount === 1 ? rootAriaLabel : undefined)}
          className={cn(
            "block h-5 w-5 rounded-full border-2 border-primary bg-background shadow-sm transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:pointer-events-none disabled:opacity-50",
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;
