import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("toggles checked state on click", async () => {
    render(<Checkbox aria-label="accept" />);
    const cb = screen.getByRole("checkbox");
    expect(cb).toHaveAttribute("data-state", "unchecked");
    await userEvent.click(cb);
    expect(cb).toHaveAttribute("data-state", "checked");
  });
  it("respects disabled prop", () => {
    render(<Checkbox aria-label="accept" disabled />);
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });
});
