// packages/ui/src/lib/utils.test.ts
import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("merges tailwind classes correctly", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });
  it("handles conditional classes", () => {
    const show = false as boolean;
    expect(cn("a", show && "b", "c")).toBe("a c");
  });
  it("handles undefined/null", () => {
    expect(cn("a", undefined, null, "b")).toBe("a b");
  });
});
