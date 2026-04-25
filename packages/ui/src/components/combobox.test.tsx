import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Combobox } from "./combobox";
import React from "react";

const options = [
  { value: "ko", label: "한국어" },
  { value: "en", label: "English" },
  { value: "ja", label: "日本語" },
];

function Controlled() {
  const [value, setValue] = React.useState<string | undefined>(undefined);
  return <Combobox options={options} value={value} onValueChange={setValue} placeholder="언어 선택" />;
}

describe("Combobox", () => {
  it("shows placeholder when no value selected", () => {
    render(<Controlled />);
    expect(screen.getByRole("combobox")).toHaveTextContent("언어 선택");
  });

  it("updates label after selecting an option", async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("English"));
    expect(screen.getByRole("combobox")).toHaveTextContent("English");
  });
});
