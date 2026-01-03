/**
 * Learning Resources Type Definitions
 *
 * Defines the structure for curated learning resources associated with skills.
 * Only high-quality, industry-standard resources are included.
 */

export type ResourceType = "book" | "course" | "article" | "documentation" | "tool" | "framework";

export type ResourceSource =
  | "NN/g" // Nielsen Norman Group
  | "IDF" // Interaction Design Foundation
  | "Coursera"
  | "Pivotal Labs"
  | "W3C"
  | "HCD" // Human-Centered Design
  | "Book"
  | "Industry";

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  source: ResourceSource;
  url: string;
  author?: string;
  year?: number;
  tags?: string[];
}

export interface SkillResources {
  skillId: string;
  resources: LearningResource[];
}
