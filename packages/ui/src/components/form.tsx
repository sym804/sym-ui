/**
 * @registry-meta
 * name: form
 * dependencies: ["react-hook-form", "@radix-ui/react-slot"]
 * internalDeps: ["utils", "label"]
 */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import { Label } from "./label";
import { cn } from "../lib/utils";

export const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = { name: TName };

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

type FormItemContextValue = { id: string };
const FormItemContext = React.createContext<FormItemContextValue | null>(null);

export const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId();
    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn("space-y-2", className)} {...props} />
      </FormItemContext.Provider>
    );
  },
);
FormItem.displayName = "FormItem";

export function useFormFieldIds() {
  const fieldCtx = React.useContext(FormFieldContext);
  const itemCtx = React.useContext(FormItemContext);
  if (!fieldCtx) throw new Error("Form components must be used within a <FormField>");
  if (!itemCtx) throw new Error("Form components must be used within a <FormItem>");
  const form = useFormContext();
  if (!form) throw new Error("Form components must be used within a <Form>");
  const { getFieldState, formState } = form;
  const state = getFieldState(fieldCtx.name, formState);
  return {
    id: itemCtx.id,
    name: fieldCtx.name,
    formItemId: `${itemCtx.id}-form-item`,
    formDescriptionId: `${itemCtx.id}-form-item-description`,
    formMessageId: `${itemCtx.id}-form-item-message`,
    ...state,
  };
}

export const FormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormFieldIds();
  return (
    <Label
      ref={ref}
      htmlFor={formItemId}
      className={cn(error && "text-red-500 dark:text-[#ff6b6b]", className)}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

export const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormFieldIds();
  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId}
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

export const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormFieldIds();
    return (
      <p
        ref={ref}
        id={formDescriptionId}
        className={cn("text-sm text-neutral-500 dark:text-[#787b86]", className)}
        {...props}
      />
    );
  },
);
FormDescription.displayName = "FormDescription";

export const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormFieldIds();
    const body = error ? String(error?.message ?? "") : children;
    if (!body) return null;
    return (
      <p
        ref={ref}
        id={formMessageId}
        className={cn("text-sm font-medium text-red-500 dark:text-[#ff6b6b]", className)}
        {...props}
      >
        {body}
      </p>
    );
  },
);
FormMessage.displayName = "FormMessage";
