import { forwardRef, type HTMLAttributes } from "react";
import { FieldErrors } from "react-hook-form";
import { ErrorMessage, type Props } from "@hookform/error-message";
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

export const StyledErrorMessage = <
  TFieldErrors extends FieldErrors,
  TAs extends
    | undefined
    | React.ReactElement
    | React.ComponentType<unknown>
    | keyof JSX.IntrinsicElements,
>(
  props: Props<TFieldErrors, TAs>,
) => (
  <ErrorMessage
    render={({ message }) => (
      <div className="text-red-500 text-sm">{message}</div>
    )}
    {...props}
  />
);
