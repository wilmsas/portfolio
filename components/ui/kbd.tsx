import * as React from "react"
import { cn } from "@/lib/utils"

export function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "rounded-md border border-border bg-card px-1.5 py-0.5 text-meta font-semibold text-muted-foreground shadow-card",
        className
      )}
    >
      {children}
    </kbd>
  )
}
