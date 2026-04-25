import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./accordion";

describe("Accordion", () => {
  it("renders all triggers", () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger>First</AccordionTrigger>
          <AccordionContent>Body A</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Second</AccordionTrigger>
          <AccordionContent>Body B</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("shows item content when defaultValue matches", () => {
    render(
      <Accordion type="single" collapsible defaultValue="a">
        <AccordionItem value="a">
          <AccordionTrigger>First</AccordionTrigger>
          <AccordionContent>Body A</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByText("Body A")).toBeInTheDocument();
  });
});
