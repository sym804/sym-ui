import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Stepper, StepperItem } from "./stepper";

describe("Stepper", () => {
  it("marks current step with aria-current", () => {
    render(
      <Stepper value={1}>
        <StepperItem label="Account" />
        <StepperItem label="Profile" />
        <StepperItem label="Done" />
      </Stepper>,
    );
    const items = screen.getAllByRole("listitem");
    expect(items[0]?.getAttribute("data-status")).toBe("complete");
    expect(items[1]?.getAttribute("aria-current")).toBe("step");
    expect(items[2]?.getAttribute("data-status")).toBe("upcoming");
  });
});
