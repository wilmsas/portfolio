/**
 * Shared types for the Design Skills Matrix
 *
 * This file contains all the type definitions used across the skills data.
 * If you need to modify the structure of skills or levels, start here.
 */

/** 5-point proficiency scale */
export const LEVELS = [1, 2, 3, 4, 5] as const;
export type Level = (typeof LEVELS)[number];

/** Human-readable labels for each level */
export const LEVEL_LABELS: Record<Level, string> = {
  1: "Learner",
  2: "Junior",
  3: "Practitioner",
  4: "Advanced",
  5: "Expert",
};

/** Details for a specific proficiency level of a skill */
export type SkillLevel = {
  title: string;
  description: string;
  bullets: string[];
};

/** A competency/skill with all 5 proficiency levels defined */
export type Skill = {
  id: string;
  label: string;
  category?: string;
  levels: Record<Level, SkillLevel>;
};

/** User's selections (skill ID -> selected level) */
export type Selections = Record<string, Level | undefined>;

/** Helper to create a skill object */
export function createSkill(
  id: string,
  label: string,
  levels: Record<Level, SkillLevel>,
  category?: string
): Skill {
  return { id, label, category, levels };
}
