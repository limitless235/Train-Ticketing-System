// src/components/ui/label.tsx
import * as React from "react"
import { Label as RadixLabel } from "@radix-ui/react-label"
import { cn } from "src/app/lib/utils"

const Label = React.forwardRef<
  React.ElementRef<typeof RadixLabel>,
  React.ComponentPropsWithoutRef<typeof RadixLabel>
>(({ className, ...props }, ref) => (
  <RadixLabel
    ref={ref}
    className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
    {...props}
  />
))

Label.displayName = "Label"

export { Label }
