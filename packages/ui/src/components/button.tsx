/**
 * @registry-meta
 * name: button
 * dependencies: ["@radix-ui/react-slot"]
 * internalDeps: ["utils"]
 */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      // v0.6.0: hover/active 를 interactive intent token 으로 통일.
      // primary/destructive 는 자체 색조 (hover:bg-primary/90 등) 유지 (filled CTA 패턴).
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/85",
        secondary: "bg-muted text-foreground hover:bg-interactive-hover active:bg-interactive-active",
        outline: "border border-border bg-surface text-foreground hover:bg-interactive-hover active:bg-interactive-active",
        ghost: "text-foreground hover:bg-interactive-hover active:bg-interactive-active",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/85",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-[8px]",
        default: "h-10 px-4",
        lg: "h-12 px-5 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
  },
);
Button.displayName = "Button";

export { buttonVariants };
