import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type FieldErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  field: string;
  errors?: Record<string, string>;
};

export const FieldError = forwardRef<HTMLParagraphElement, FieldErrorProps>(
  ({ field, errors, className, ...props }, ref) => {
    const message = (errors && errors[field]) ?? null;

    if (message == null) return null;

    return (
      <p
        ref={ref}
        className={cn("text-[0.8rem] font-medium text-destructive", className)}
        {...props}
      >
        {message}
      </p>
    );
  },
);
FieldError.displayName = "FieldError";
