/**
 * Skills Data Index
 *
 * Central export point for all skills matrix data.
 * Import from here instead of individual files for convenience.
 */

// Export types
export type { Skill, SkillLevel, Level, Selections } from "./types";
export { LEVELS, LEVEL_LABELS, createSkill } from "./types";

// Export skill data
export { baselineSkills } from "./baseline";
export { strategistSkills } from "./strategist";
export { uiDesignerSkills } from "./ui-designer";
export { uxArchitectSkills } from "./ux-architect";
export { visualDesignerSkills } from "./visual-designer";

import { Skill } from "./types";
import { baselineSkills } from "./baseline";
import { strategistSkills } from "./strategist";
import { uiDesignerSkills } from "./ui-designer";
import { uxArchitectSkills } from "./ux-architect";
import { visualDesignerSkills } from "./visual-designer";

/**
 * Registry of all specialty skill sets
 * Use this to dynamically access specialty skills by key
 */
export const specialtySkills: Record<string, Skill[]> = {
  strategist: strategistSkills,
  "ui-designer": uiDesignerSkills,
  "ux-architect": uxArchitectSkills,
  "visual-designer": visualDesignerSkills,
};

/**
 * Human-readable labels for specialties
 */
export const specialtyLabels: Record<string, string> = {
  strategist: "UX Strategist",
  "ui-designer": "UI Designer",
  "ux-architect": "UX Architect",
  "visual-designer": "Visual Designer",
};

/**
 * Options for specialty selector dropdown
 */
export const specialtyOptions = [
  { value: "strategist", label: "UX Strategist" },
  { value: "ui-designer", label: "UI Designer" },
  { value: "ux-architect", label: "UX Architect" },
  { value: "visual-designer", label: "Visual Designer" },
  { value: "none", label: "None" },
];

/**
 * LocalStorage keys for persisting skill selections
 */
export const STORAGE_KEYS = {
  baseline: "design-skills-matrix:lanes:baseline:v6",
  strategist: "design-skills-matrix:lanes:strategist:v6",
  uiDesigner: "design-skills-matrix:lanes:ui-designer:v1",
  uxArchitect: "design-skills-matrix:lanes:ux-architect:v1",
  visualDesigner: "design-skills-matrix:lanes:visual-designer:v1",
} as const;
