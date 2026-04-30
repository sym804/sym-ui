import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "./drawer";

describe("Drawer", () => {
  it("opens content when trigger clicked, exposes title via aria", async () => {
    render(
      <Drawer>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Settings</DrawerTitle>
            <DrawerDescription>Adjust preferences</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>,
    );
    await userEvent.click(screen.getByText("Open"));
    expect(screen.getByRole("dialog", { name: "Settings" })).toBeInTheDocument();
  });
});
