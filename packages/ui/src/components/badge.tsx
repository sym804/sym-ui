/**
 * @registry-meta
 * name: badge
 * dependencies: []
 * internalDeps: ["utils"]
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-[0.2px]",
  {
    variants: {
      variant: {
        primary: "bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300",
        neutral: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
        success: "bg-success/10 text-success dark:bg-success/20",
        warning: "bg-warning/10 text-warning dark:bg-warning/20",
        danger: "bg-danger/10 text-danger dark:bg-danger/20",
        outline: "border border-neutral-200 text-neutral-700 dark:border-neutral-700/50 dark:text-neutral-300",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant, className }))} {...props} />
  ),
);
Badge.displayName = "Badge";

export { badgeVariants };
