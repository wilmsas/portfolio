"use client"

import * as React from "react"
import { AnimatePresence, m } from "framer-motion"
import { cn } from "@/lib/utils"
import { SPRING } from "@/lib/motion"

interface ModalProps {
  open: boolean
  onClose: () => void
  /** Max width of the panel, e.g. "680px" or "760px". Defaults to "680px". */
  maxWidth?: string
  className?: string
  children: React.ReactNode
}

export function Modal({ open, onClose, maxWidth = "680px", className, children }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal>
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <m.div
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={SPRING}
            style={{ width: `min(${maxWidth}, 92vw)` }}
            className={cn(
              "absolute left-1/2 top-24 -translate-x-1/2 overflow-hidden rounded-3xl border border-border bg-card shadow-overlay",
              className
            )}
          >
            {children}
          </m.div>
        </div>
      )}
    </AnimatePresence>
  )
}
