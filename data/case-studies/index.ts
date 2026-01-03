/**
 * Case Studies Data Index
 *
 * Central export point for all case study data.
 * Import from here instead of individual files for convenience.
 */

// Export types
export type { CaseStudy } from "./types";

// Export individual case studies
export { mysquad } from "./mysquad";
export { atlas } from "./atlas";
export { tesseract } from "./tesseract";
export { logtak } from "./logtak";

// Import for convenience
import { CaseStudy } from "./types";
import { mysquad } from "./mysquad";
import { atlas } from "./atlas";
import { tesseract } from "./tesseract";
import { logtak } from "./logtak";

/**
 * Array of all case studies in display order
 */
export const allCaseStudies: CaseStudy[] = [
  mysquad,
  atlas,
  tesseract,
  logtak,
];

/**
 * Get a case study by ID
 */
export function getCaseStudyById(id: string): CaseStudy | undefined {
  return allCaseStudies.find((caseStudy) => caseStudy.id === id);
}
