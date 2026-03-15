import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const containerVariants = cva(
  "rounded-[2.25rem] border border-border bg-card",
  {
    variants: {
      padding: {
        default: "p-6 md:p-8",
        dense: "p-4 md:p-5",
        comfortable: "p-8 md:p-10",
        none: "",
      },
      shadow: {
        none: "",
        card: "shadow-card",
        hover: "shadow-card-hover",
        overlay: "shadow-overlay",
      },
    },
    defaultVariants: {
      padding: "default",
      shadow: "card",
    },
  }
)

export interface ContainerProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof containerVariants> {
  as?: React.ElementType
}

const Container = React.forwardRef<HTMLElement, ContainerProps>(
  ({ className, padding, shadow, as: Comp = "section", ...props }, ref) => {
    return (
      <Comp
        ref={ref}
        className={cn(containerVariants({ padding, shadow, className }))}
        {...props}
      />
    )
  }
)
Container.displayName = "Container"

export { Container, containerVariants }
