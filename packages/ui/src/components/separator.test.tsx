import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Separator } from "./separator";

describe("Separator", () => {
  it("renders horizontal by default", () => {
    render(<Separator data-testid="sep" />);
    const el = screen.getByTestId("sep");
    expect(el.getAttribute("data-orientation")).toBe("horizontal");
  });
  it("supports vertical orientation", () => {
    render(<Separator orientation="vertical" data-testid="sep" />);
    expect(screen.getByTestId("sep").getAttribute("data-orientation")).toBe("vertical");
  });
});
