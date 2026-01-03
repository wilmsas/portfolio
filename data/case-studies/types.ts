/**
 * Case Studies Data Types
 *
 * Type definitions for case study content structure.
 */

export interface CaseStudy {
  id: string;
  title: string;
  outcome: string;
  tags: string[];
  time: string;
  impact: string[];
  preview: {
    problem: string;
    myRole: string;
    move: string;
  };
  fullContent?: {
    executiveSummary: string;
    problemStatement: string;
    users?: {
      primary: string[];
      scale: string;
      environment?: string;
    };
    constraints?: Array<{
      title: string;
      description: string;
    }>;
    designStrategy?: string;
    solution?: {
      title: string;
      description?: string;
      steps?: string[];
      benefits?: string[];
      features?: string[];
    };
    additionalCapabilities?: string[];
    reflection?: string;
  };
}
