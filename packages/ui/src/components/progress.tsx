/**
 * @registry-meta
 * name: progress
 * dependencies: ["@radix-ui/react-progress"]
 * internalDeps: ["utils"]
 */
import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "../lib/utils";

export const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, max = 100, ...props }, ref) => {
  const isValid =
    typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= max;
  const percent = isValid ? (value / max) * 100 : null;
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-[#2a2d3e]",
        className,
      )}
      value={isValid ? value : null}
      max={max}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-progress-indicator
        className="h-full w-full flex-1 bg-blue-500 transition-transform dark:bg-[#3d7eff]"
        style={{ transform: percent !== null ? `translateX(-${100 - percent}%)` : undefined }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;
