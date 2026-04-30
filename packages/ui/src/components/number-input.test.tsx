import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NumberInput } from "./number-input";

describe("NumberInput", () => {
  it("renders increment/decrement buttons with aria-label", () => {
    render(<NumberInput defaultValue={1} />);
    expect(screen.getByRole("button", { name: "Increase" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Decrease" })).toBeInTheDocument();
  });
  it("increments and decrements on click", async () => {
    const onChange = vi.fn();
    render(<NumberInput defaultValue={5} step={2} onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Increase" }));
    expect(onChange).toHaveBeenLastCalledWith(7);
    await userEvent.click(screen.getByRole("button", { name: "Decrease" }));
    expect(onChange).toHaveBeenLastCalledWith(5);
  });
  it("clamps to max", async () => {
    const onChange = vi.fn();
    render(<NumberInput defaultValue={9} max={10} onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Increase" }));
    expect(onChange).toHaveBeenLastCalledWith(10);
    await userEvent.click(screen.getByRole("button", { name: "Increase" }));
    // disabled when at max -> no further onChange
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
