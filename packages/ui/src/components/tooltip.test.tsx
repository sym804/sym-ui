import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "./tooltip";

describe("Tooltip", () => {
  it("shows content on hover", async () => {
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Helpful hint</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    await userEvent.hover(screen.getByText("Hover me"));
    // Radix Tooltip renders the content twice: once visible, once as an
    // sr-only role="tooltip" sibling for screen readers. Assert via role
    // so we target the authoritative accessibility node.
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Helpful hint");
  });
});
