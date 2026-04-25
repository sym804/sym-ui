import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";

describe("Popover", () => {
  it("renders content when defaultOpen", () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Popover body</PopoverContent>
      </Popover>,
    );
    expect(screen.getByText("Popover body")).toBeInTheDocument();
  });

  it("does not render content when closed", () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Hidden body</PopoverContent>
      </Popover>,
    );
    expect(screen.queryByText("Hidden body")).not.toBeInTheDocument();
  });
});
