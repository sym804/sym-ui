import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Progress } from "./progress";

describe("Progress", () => {
  it("renders with aria-valuenow matching value", () => {
    const { container } = render(<Progress value={40} />);
    const bar = container.querySelector('[role="progressbar"]');
    expect(bar).toBeInTheDocument();
    expect(bar?.getAttribute("aria-valuenow")).toBe("40");
  });

  it("indicator translate reflects value", () => {
    const { container } = render(<Progress value={25} />);
    const indicator = container.querySelector<HTMLElement>("[data-progress-indicator]");
    expect(indicator?.style.transform).toBe("translateX(-75%)");
  });
});
