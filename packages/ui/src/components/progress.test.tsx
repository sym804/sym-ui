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

  it("renders in indeterminate state when value is null", () => {
    const { container } = render(<Progress value={null} />);
    const bar = container.querySelector('[role="progressbar"]');
    expect(bar?.getAttribute("aria-valuenow")).toBeNull();
    expect(bar?.getAttribute("data-state")).toBe("indeterminate");
  });

  it("scales transform by custom max", () => {
    const { container } = render(<Progress value={50} max={200} />);
    const indicator = container.querySelector<HTMLElement>("[data-progress-indicator]");
    expect(indicator?.style.transform).toBe("translateX(-75%)");
  });

  it("treats out-of-range value as indeterminate", () => {
    const { container } = render(<Progress value={150} max={100} />);
    const bar = container.querySelector('[role="progressbar"]');
    expect(bar?.getAttribute("data-state")).toBe("indeterminate");
  });
});
