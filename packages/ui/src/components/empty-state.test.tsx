import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("renders title + description as status region", () => {
    render(<EmptyState title="결과 없음" description="필터를 조정해 보세요." />);
    const status = screen.getByRole("status");
    expect(status).toContainElement(screen.getByText("결과 없음"));
    expect(status).toContainElement(screen.getByText("필터를 조정해 보세요."));
  });
});
