import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const FieldHelp = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  );
});

FieldHelp.displayName = "FieldHelp";
