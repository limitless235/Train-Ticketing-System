import * as React from "react";
import { cn } from "src/app/lib/utils"; // If you don't have this, see note below

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type = "button", ...props }, ref) => (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground " +
        "transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
        "focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = "Button";
