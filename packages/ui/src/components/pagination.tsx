/**
 * @registry-meta
 * name: pagination
 * dependencies: ["lucide-react"]
 * internalDeps: ["utils", "button"]
 *
 * 접근성: nav 컨테이너에 aria-label="Pagination" 적용. 현재 페이지는 aria-current="page".
 */
import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "../lib/utils";
import { buttonVariants } from "./button";

export const Pagination = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <nav
    role="navigation"
    aria-label="Pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

export const PaginationContent = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
  ),
);
PaginationContent.displayName = "PaginationContent";

export const PaginationItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn("", className)} {...props} />,
);
PaginationItem.displayName = "PaginationItem";

export interface PaginationLinkProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  size?: "sm" | "default" | "lg" | "icon";
}

export const PaginationLink = React.forwardRef<HTMLButtonElement, PaginationLinkProps>(
  ({ className, isActive, size = "icon", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({ variant: isActive ? "outline" : "ghost", size }),
        className,
      )}
      {...props}
    />
  ),
);
PaginationLink.displayName = "PaginationLink";

export const PaginationPrevious = React.forwardRef<HTMLButtonElement, PaginationLinkProps>(
  ({ className, ...props }, ref) => (
    <PaginationLink
      ref={ref}
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5", className)}
      {...props}
    >
      <ChevronLeft aria-hidden className="h-4 w-4" />
      <span>Previous</span>
    </PaginationLink>
  ),
);
PaginationPrevious.displayName = "PaginationPrevious";

export const PaginationNext = React.forwardRef<HTMLButtonElement, PaginationLinkProps>(
  ({ className, ...props }, ref) => (
    <PaginationLink
      ref={ref}
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5", className)}
      {...props}
    >
      <span>Next</span>
      <ChevronRight aria-hidden className="h-4 w-4" />
    </PaginationLink>
  ),
);
PaginationNext.displayName = "PaginationNext";

export const PaginationEllipsis = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  // 부모 자체에는 aria-hidden 을 두지 않는다. 시각용 글리프만 aria-hidden 으로 숨기고
  // 스크린 리더용 "More pages" 는 sr-only 로 그대로 노출되도록 분리.
  <span
    className={cn("flex h-9 w-9 items-center justify-center text-muted-foreground", className)}
    {...props}
  >
    <MoreHorizontal aria-hidden className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";
