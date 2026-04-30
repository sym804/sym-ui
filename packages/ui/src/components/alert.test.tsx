import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Alert, AlertTitle, AlertDescription } from "./alert";

describe("Alert", () => {
  it("uses role='status' for info variant", () => {
    render(
      <Alert>
        <AlertTitle>Hi</AlertTitle>
      </Alert>,
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
  it("uses role='alert' for destructive variant", () => {
    render(
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong</AlertDescription>
      </Alert>,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
  it("respects explicit role override", () => {
    render(<Alert role="region" aria-label="x" variant="destructive">x</Alert>);
    expect(screen.getByRole("region")).toBeInTheDocument();
  });
});
