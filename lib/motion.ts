/**
 * Shared Framer Motion presets.
 * Import from here instead of hard-coding animation values inline.
 */

/** Spring for modals, dialogs, and overlays. */
export const SPRING = { type: "spring", stiffness: 380, damping: 30 } as const

/** Standard page/view transition. */
export const PAGE_TRANSITION = { duration: 0.18 } as const

/** Fade + slide up — for page-level sections. */
export const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 6 },
} as const

/** Fade + small slide up — for inline elements (toasts, badges, confirmations). */
export const fadeUpSm = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 6 },
} as const

/** Stagger container — propagates stagger to variant children. */
export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
} as const

/** Stagger item — subtle opacity + rise with ease-out-expo. */
export const staggerItem = {
  hidden: { opacity: 0, y: 4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
} as const
