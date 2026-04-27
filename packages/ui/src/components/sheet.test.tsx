import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Sheet, SheetTrigger, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./sheet";

describe("Sheet", () => {
  it("renders content when defaultOpen", () => {
    render(
      <Sheet defaultOpen>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Sheet title</SheetTitle>
            <SheetDescription>Sheet 설명</SheetDescription>
          </SheetHeader>
          <p>Sheet body</p>
        </SheetContent>
      </Sheet>,
    );
    expect(screen.getByText("Sheet title")).toBeInTheDocument();
    expect(screen.getByText("Sheet 설명")).toBeInTheDocument();
    expect(screen.getByText("Sheet body")).toBeInTheDocument();
  });
});
