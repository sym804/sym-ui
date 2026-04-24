import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./input";

describe("Input", () => {
  it("renders with placeholder", () => {
    render(<Input placeholder="Email" />);
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  });
  it("calls onChange when typed", async () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} placeholder="x" />);
    await userEvent.type(screen.getByPlaceholderText("x"), "a");
    expect(onChange).toHaveBeenCalled();
  });
  it("applies error styling when data-error is set", () => {
    render(<Input data-error placeholder="x" />);
    expect(screen.getByPlaceholderText("x").className).toMatch(/border-danger/);
  });
  it("is disabled when disabled prop is set", () => {
    render(<Input disabled placeholder="x" />);
    expect(screen.getByPlaceholderText("x")).toBeDisabled();
  });
  it("forwards ref", () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input ref={ref} placeholder="x" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
