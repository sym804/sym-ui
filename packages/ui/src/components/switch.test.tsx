import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "./switch";

describe("Switch", () => {
  it("toggles state on click", async () => {
    render(<Switch aria-label="notifications" />);
    const sw = screen.getByRole("switch");
    expect(sw).toHaveAttribute("data-state", "unchecked");
    await userEvent.click(sw);
    expect(sw).toHaveAttribute("data-state", "checked");
  });
});
