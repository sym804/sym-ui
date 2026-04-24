import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders text", () => {
    render(<Badge>NEW</Badge>);
    expect(screen.getByText("NEW")).toBeInTheDocument();
  });
  it("applies variant classes", () => {
    render(<Badge variant="success">OK</Badge>);
    expect(screen.getByText("OK").className).toMatch(/success/);
  });
  it("renders outline variant with border", () => {
    render(<Badge variant="outline">X</Badge>);
    expect(screen.getByText("X").className).toMatch(/border/);
  });
});
