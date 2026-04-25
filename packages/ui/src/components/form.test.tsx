import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./form";
import { Input } from "./input";
import React from "react";

const schema = z.object({
  email: z.string().email("invalid email"),
});
type Values = z.infer<typeof schema>;

function Demo({ onSubmit }: { onSubmit: (v: Values) => void }) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} placeholder="name@company.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </Form>
  );
}

describe("Form", () => {
  it("renders label bound to input via htmlFor", () => {
    render(<Demo onSubmit={() => {}} />);
    const input = screen.getByLabelText("Email");
    expect(input).toBeInTheDocument();
  });

  it("shows zod validation error after submit", async () => {
    const user = userEvent.setup();
    render(<Demo onSubmit={() => {}} />);
    await user.type(screen.getByLabelText("Email"), "not-an-email");
    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(await screen.findByText("invalid email")).toBeInTheDocument();
  });
});
