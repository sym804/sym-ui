/**
 * @registry-meta
 * name: badge
 * dependencies: ["@radix-ui/react-slot"]
 * internalDeps: ["utils"]
 *
 * asChild 사용 시 NavLink/anchor 등을 Badge 스타일로 감쌀 수 있습니다.
 *
 * caveat: ref 타입은 HTMLSpanElement 로 고정. asChild 로 다른 element 를 넘길 때
 * ref 를 사용하려면 사용자 측에서 cast 하세요 (shadcn/ui 와 동일한 약속).
 */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

// v0.6.0: success / warning / danger variant 를 intent token 기반 (status-*-bg/-fg) 으로
// 마이그레이션. 다크 모드 색상은 토큰의 .dark 변종에서 자동 처리되므로 dark: 프리픽스 불필요.
const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-[0.2px]",
  {
    variants: {
      // v0.8.0: primary variant 의 text 를 primary-700/-200 으로 진하게 해 WCAG AA
      // 대비 (4.5:1) 확보. 기존 text-primary 는 bg-primary/15 위에서 contrast 미달.
      variant: {
        primary: "bg-primary/15 text-primary-700 dark:text-primary-200",
        neutral: "bg-muted text-foreground",
        success: "bg-status-success-bg text-status-success-fg",
        warning: "bg-status-warning-bg text-status-warning-fg",
        danger: "bg-status-danger-bg text-status-danger-fg",
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
