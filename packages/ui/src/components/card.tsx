/**
 * @registry-meta
 * name: card
 * dependencies: ["@radix-ui/react-slot"]
 * internalDeps: ["utils"]
 *
 * asChild 사용 시 단일 자식 요소를 받아 그 요소가 Card 의 클래스/속성을 흡수합니다.
 * Link 로 감쌀 때 유용합니다 (e.g. <Card asChild><a href="...">...</a></Card>).
 *
 * caveat: ref 타입은 HTMLDivElement 로 고정되어 있으므로 asChild 로 다른 element
 * (a, button 등) 를 넘길 때 ref 를 보유하려면 사용자 측에서 해당 element 의 ref 타입을
 * 직접 선언하고 cast 하세요. 이는 shadcn/ui 와 동일한 약속입니다.
 */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn("rounded-md border border-border bg-surface p-5 text-foreground shadow-sm", className)}
        {...props}
      />
    );
  },
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1 mb-3", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h4 ref={ref} className={cn("text-base font-bold text-foreground", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("text-sm", className)} {...props} />,
);
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-end gap-2 pt-3 mt-3 border-t border-border", className)}
      {...props}
    />
  ),
);
CardFooter.displayName = "CardFooter";
