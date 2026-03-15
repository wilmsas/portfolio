import * as React from "react"
import { cn } from "@/lib/utils"

export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-card/80 px-2.5 py-1 text-xs font-medium text-muted-foreground",
        className
      )}
    >
      {children}
    </span>
  )
}
