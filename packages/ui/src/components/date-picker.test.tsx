import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DatePicker } from "./date-picker";
import React from "react";

function Controlled() {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  return <DatePicker value={date} onChange={setDate} placeholder="날짜 선택" />;
}

describe("DatePicker", () => {
  it("shows placeholder when no value selected", () => {
    render(<Controlled />);
    expect(screen.getByRole("button")).toHaveTextContent("날짜 선택");
  });

  it("shows formatted value when value provided", () => {
    render(<DatePicker value={new Date(2026, 3, 25)} onChange={() => {}} />);
    expect(screen.getByRole("button")).toHaveTextContent("2026-04-25");
  });
});
