/**
 * Utility functions for the Design Skills Matrix
 *
 * These helper functions are used across multiple components in the skills matrix.
 * They handle common tasks like clamping values, parsing JSON, normalizing selections,
 * and wrapping SVG labels for better display.
 */

import type { Level, Skill, Selections } from "@/data/skills/types";

/**
 * Clamps a number between a minimum and maximum value
 * @param n The number to clamp
 * @param min The minimum allowed value
 * @param max The maximum allowed value
 * @returns The clamped value
 */
export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Safely parses JSON with error handling
 * @param raw The raw JSON string to parse
 * @returns The parsed object or null if parsing fails
 */
export function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Normalizes user selections to ensure all values are valid
 * This function validates that:
 * - Only valid skill IDs are included
 * - All values are valid levels (1-5)
 * - Legacy data is migrated to the current scale
 *
 * @param raw Raw selections data (potentially from localStorage)
 * @param skills Array of valid skills
 * @returns Normalized selections object
 */
export function normalizeSelections(raw: any, skills: Skill[]): Selections {
  const out: Selections = {};
  if (!raw || typeof raw !== "object") return out;

  const validIds = new Set(skills.map((s) => s.id));

  for (const [k, v] of Object.entries(raw)) {
    if (!validIds.has(k)) continue;
    if (typeof v !== "number" || !Number.isFinite(v)) continue;

    const n = Math.round(v);
    if (n < 1) continue;
    out[k] = clamp(n, 1, 5) as Level;
  }

  return out;
}

/**
 * Wraps long SVG labels into multiple lines for better display
 * Only wraps labels longer than 18 characters
 *
 * @param label The label text to wrap
 * @returns Array of text lines (1 or 2 lines)
 */
export function wrapSvgLabel(label: string): string[] {
  const s = String(label || "").trim();
  // Only wrap very long labels (target: "Information Architecture")
  if (s.length <= 18) return [s];
  const words = s.split(/\s+/).filter(Boolean);
  if (words.length <= 1) return [s];
  // Split roughly in half
  const mid = Math.ceil(words.length / 2);
  const line1 = words.slice(0, mid).join(" ");
  const line2 = words.slice(mid).join(" ");
  return [line1, line2].filter(Boolean);
}
