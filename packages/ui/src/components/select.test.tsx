import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./select";

describe("Select", () => {
  it("renders trigger with placeholder", () => {
    render(
      <Select>
        <SelectTrigger aria-label="Framework">
          <SelectValue placeholder="Select a framework" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="react">React</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByText("Select a framework")).toBeInTheDocument();
  });
});
