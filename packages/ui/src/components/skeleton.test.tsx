import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Skeleton } from "./skeleton";

describe("Skeleton", () => {
  it("renders with animate-pulse", () => {
    const { container } = render(<Skeleton className="h-4 w-40" data-testid="sk" />);
    const el = container.querySelector('[data-testid="sk"]');
    expect(el).toBeInTheDocument();
    expect(el?.className).toMatch(/animate-pulse/);
  });
  it("merges custom className", () => {
    const { container } = render(<Skeleton className="h-10" data-testid="sk" />);
    expect(container.querySelector('[data-testid="sk"]')?.className).toMatch(/h-10/);
  });
});
