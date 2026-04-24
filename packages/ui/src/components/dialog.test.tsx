import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./dialog";

describe("Dialog", () => {
  it("renders title when open", () => {
    render(
      <Dialog open>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>My Dialog</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.getByText("My Dialog")).toBeInTheDocument();
  });
  it("does not render content when closed", () => {
    render(
      <Dialog open={false}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Hidden</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });
});
