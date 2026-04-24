import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";

describe("Avatar", () => {
  it("renders fallback when no image", () => {
    render(
      <Avatar>
        <AvatarFallback>SY</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByText("SY")).toBeInTheDocument();
  });
  it("renders fallback text when image provided (jsdom does not load images)", () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="/a.png" alt="user" />
        <AvatarFallback>X</AvatarFallback>
      </Avatar>,
    );
    expect(container.textContent).toContain("X");
  });
});
