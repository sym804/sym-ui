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
  const safeMax = typeof max === "number" && Number.isFinite(max) && max > 0 ? max : 100;
  const isValid =
    typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= safeMax;
  const percent = isValid ? (value / safeMax) * 100 : null;
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-muted", className)}
      value={isValid ? value : null}
      max={safeMax}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-progress-indicator
        className="h-full w-full flex-1 bg-primary transition-transform"
        style={{ transform: percent !== null ? `translateX(-${100 - percent}%)` : undefined }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;
