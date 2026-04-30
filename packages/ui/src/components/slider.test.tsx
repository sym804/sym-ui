import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Slider } from "./slider";

describe("Slider", () => {
  it("renders single thumb with default value", () => {
    render(<Slider defaultValue={[40]} max={100} step={1} aria-label="Volume" />);
    const thumbs = screen.getAllByRole("slider");
    expect(thumbs).toHaveLength(1);
    expect(thumbs[0]).toHaveAttribute("aria-valuenow", "40");
  });
  it("supports range mode with two thumbs", () => {
    render(<Slider defaultValue={[20, 80]} max={100} aria-label="Range" />);
    expect(screen.getAllByRole("slider")).toHaveLength(2);
  });
});
