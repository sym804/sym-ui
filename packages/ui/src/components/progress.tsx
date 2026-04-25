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
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-[#2a2d3e]",
      className,
    )}
    value={value}
    {...props}
  >
    <ProgressPrimitive.Indicator
      data-progress-indicator
      className="h-full w-full flex-1 bg-blue-500 transition-transform dark:bg-[#3d7eff]"
      style={{
        transform: typeof value === "number" ? `translateX(-${100 - value}%)` : undefined,
      }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;
