import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RadioGroup, RadioGroupItem } from "./radio-group";

describe("RadioGroup", () => {
  it("renders all items as radios", () => {
    render(
      <RadioGroup defaultValue="a">
        <RadioGroupItem value="a" aria-label="Option A" />
        <RadioGroupItem value="b" aria-label="Option B" />
      </RadioGroup>,
    );
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });

  it("marks the defaultValue as checked", () => {
    render(
      <RadioGroup defaultValue="b">
        <RadioGroupItem value="a" aria-label="A" />
        <RadioGroupItem value="b" aria-label="B" />
      </RadioGroup>,
    );
    expect(screen.getByLabelText("B")).toBeChecked();
    expect(screen.getByLabelText("A")).not.toBeChecked();
  });
});
