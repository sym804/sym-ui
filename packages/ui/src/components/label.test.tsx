import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Label } from "./label";

describe("Label", () => {
  it("renders text", () => {
    render(<Label>Email</Label>);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });
  it("shows required indicator when required prop is true", () => {
    render(<Label required>Name</Label>);
    expect(screen.getByText("Name").parentElement).toHaveTextContent(/\*/);
  });
  it("associates with input via htmlFor", () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </>,
    );
    expect(screen.getByText("Email").closest("label")).toHaveAttribute("for", "email");
  });
});
