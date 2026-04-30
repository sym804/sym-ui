/**
 * @registry-meta
 * name: toast
 * dependencies: ["@radix-ui/react-toast"]
 * internalDeps: ["utils"]
 */
import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

export const ToastProvider = ToastPrimitive.Provider;

export const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn("fixed bottom-4 right-4 z-[100] flex max-h-screen w-96 flex-col gap-2", className)}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

// v0.6.0: variant 별로 background / text / border 모두를 intent token (status-*-bg/-fg)
// 기반으로 마이그레이션. 이전엔 border 만 색조였고 bg 가 popover 라 의미가 약했음.
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start gap-3 rounded-md border p-4 shadow-lg",
  {
    variants: {
      variant: {
        info: "bg-status-info-bg text-status-info-fg border-status-info-fg/30",
        success: "bg-status-success-bg text-status-success-fg border-status-success-fg/30",
        warning: "bg-status-warning-bg text-status-warning-fg border-status-warning-fg/30",
        danger: "bg-status-danger-bg text-status-danger-fg border-status-danger-fg/30",
      },
    },
    defaultVariants: { variant: "success" },
  },
);

export interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root>,
    VariantProps<typeof toastVariants> {}

export const Toast = React.forwardRef<React.ElementRef<typeof ToastPrimitive.Root>, ToastProps>(
  ({ className, variant, ...props }, ref) => (
    <ToastPrimitive.Root
      ref={ref}
      data-variant={variant ?? "success"}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  ),
);
Toast.displayName = ToastPrimitive.Root.displayName;

export const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title ref={ref} className={cn("text-sm font-bold", className)} {...props} />
));
ToastTitle.displayName = ToastPrimitive.Title.displayName;

export const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  // text-current 로 두면 Toast 의 status text 색상을 자연 상속. opacity 로 description 어조 약화.
  <ToastPrimitive.Description ref={ref} className={cn("text-xs opacity-80", className)} {...props} />
));
ToastDescription.displayName = ToastPrimitive.Description.displayName;

export { toastVariants };
