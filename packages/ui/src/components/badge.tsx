/**
 * @registry-meta
 * name: badge
 * dependencies: ["@radix-ui/react-slot"]
 * internalDeps: ["utils"]
 *
 * asChild 사용 시 NavLink/anchor 등을 Badge 스타일로 감쌀 수 있습니다.
 */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-[0.2px]",
  {
    variants: {
      variant: {
        primary: "bg-primary/15 text-primary",
        neutral: "bg-muted text-foreground",
        success: "bg-success/10 text-success dark:bg-success/20",
        warning: "bg-warning/10 text-warning dark:bg-warning/20",
        danger: "bg-destructive/10 text-destructive",
        outline: "border border-border text-foreground",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";
    return <Comp ref={ref} className={cn(badgeVariants({ variant, className }))} {...props} />;
  },
);
Badge.displayName = "Badge";

export { badgeVariants };
