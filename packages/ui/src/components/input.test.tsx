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
  it("sets data-error attribute when prop is passed", () => {
    render(<Input data-error="true" placeholder="has-error" />);
    expect(screen.getByPlaceholderText("has-error")).toHaveAttribute("data-error", "true");
  });
  it("omits data-error attribute when prop is absent", () => {
    render(<Input placeholder="no-error" />);
    expect(screen.getByPlaceholderText("no-error")).not.toHaveAttribute("data-error");
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
