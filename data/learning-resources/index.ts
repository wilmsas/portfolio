/**
 * Learning Resources Index
 *
 * Central export for all learning resources
 */

export * from "./types";
export { baselineResources } from "./baseline-resources";

// Helper function to get resources for a specific skill
import type { SkillResources, LearningResource } from "./types";
import { baselineResources } from "./baseline-resources";

export function getResourcesForSkill(skillId: string): LearningResource[] {
  const skillResources = baselineResources.find((sr) => sr.skillId === skillId);
  return skillResources?.resources || [];
}

export function getAllResources(): SkillResources[] {
  return baselineResources;
}
