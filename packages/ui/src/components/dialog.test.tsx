import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./dialog";

describe("Dialog", () => {
  it("renders title and description when open", () => {
    render(
      <Dialog open>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>My Dialog</DialogTitle>
          <DialogDescription>설명 텍스트</DialogDescription>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.getByText("My Dialog")).toBeInTheDocument();
    expect(screen.getByText("설명 텍스트")).toBeInTheDocument();
  });
  it("does not render content when closed", () => {
    render(
      <Dialog open={false}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Hidden</DialogTitle>
          <DialogDescription>안 보임</DialogDescription>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });
});
