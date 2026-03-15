import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "w-full rounded-lg border bg-background px-4 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-border focus:ring-ring",
        error: "border-destructive bg-destructive/10 focus:ring-destructive",
      },
      inputSize: {
        default: "h-10 py-2",
        sm: "h-8 py-1.5 text-xs",
        lg: "h-11 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(inputVariants({ variant: error ? "error" : variant, inputSize, className }))}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
