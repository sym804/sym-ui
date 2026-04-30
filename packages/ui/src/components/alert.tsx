/**
 * @registry-meta
 * name: alert
 * dependencies: []
 * internalDeps: ["utils"]
 *
 * 접근성: AlertVariant 가 destructive/warning 일 때 role="alert" 가 적용되어 스크린 리더에
 * 즉시 안내됩니다. info/success 는 role="status" (덜 침투적) 로 안내됩니다.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const alertVariants = cva(
  "relative w-full rounded-md border px-4 py-3 text-sm [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-2px] [&:has(svg)]:pl-11",
  {
    variants: {
      variant: {
        info: "border-border bg-surface text-foreground",
        success: "border-success/30 bg-success/10 text-success",
        warning: "border-warning/30 bg-warning/10 text-warning",
        destructive: "border-destructive/30 bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: { variant: "info" },
  },
);

const ASSERTIVE_VARIANTS: ReadonlyArray<NonNullable<VariantProps<typeof alertVariants>["variant"]>> = [
  "warning",
  "destructive",
];

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, role, ...props }, ref) => {
    const v = variant ?? "info";
    const inferredRole = role ?? (ASSERTIVE_VARIANTS.includes(v) ? "alert" : "status");
    return (
      <div
        ref={ref}
        role={inferredRole}
        className={cn(alertVariants({ variant: v, className }))}
        {...props}
      />
    );
  },
);
Alert.displayName = "Alert";

export const AlertTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("mb-1 font-semibold leading-none tracking-tight", className)} {...props} />
  ),
);
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
  ),
);
AlertDescription.displayName = "AlertDescription";

export { alertVariants };
