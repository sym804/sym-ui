import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "./command";

describe("Command", () => {
  it("renders items under a group", () => {
    render(
      <Command>
        <CommandInput placeholder="Type..." />
        <CommandList>
          <CommandEmpty>No results</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>,
    );
    expect(screen.getByText("Suggestions")).toBeInTheDocument();
    expect(screen.getByText("Calendar")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
  });
});
