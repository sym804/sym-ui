import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Toast, ToastTitle, ToastDescription, ToastProvider, ToastViewport } from "./toast";

describe("Toast", () => {
  it("renders toast content inside provider", () => {
    render(
      <ToastProvider>
        <Toast open>
          <ToastTitle>Saved</ToastTitle>
          <ToastDescription>Changes stored</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    );
    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("Changes stored")).toBeInTheDocument();
  });
  it("applies variant styling", () => {
    render(
      <ToastProvider>
        <Toast open variant="danger">
          <ToastTitle>Err</ToastTitle>
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    );
    const el = screen.getByText("Err").closest("[data-variant]");
    expect(el?.getAttribute("data-variant")).toBe("danger");
  });
});
