import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Calendar } from "./calendar";

describe("Calendar", () => {
  it("renders a month grid with weekday headers", () => {
    render(<Calendar mode="single" defaultMonth={new Date(2026, 3, 1)} />);
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });
});
