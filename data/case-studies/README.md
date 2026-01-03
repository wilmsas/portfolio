# Case Studies Data

This directory contains all case study content for the portfolio site, separated into individual files for easy editing and maintenance.

## Structure

```
data/case-studies/
├── README.md           # This file
├── types.ts            # TypeScript type definitions
├── index.ts            # Central export point
├── mysquad.ts          # MySquad case study
├── atlas.ts            # Atlas case study
├── tesseract.ts        # Tesseract case study
└── logtak.ts           # LOGTAK case study
```

## Editing Content

To edit a case study, simply open its file and modify the content. All changes will be reflected immediately in the portfolio.

### Example: Editing MySquad

Open `mysquad.ts` and modify any field:

```typescript
export const mysquad: CaseStudy = {
  id: "mysquad",
  title: "MySquad — Squad Analytics & Counseling Tool",
  outcome: "Army-wide leadership enablement at scale",
  tags: ["Defense", "Army-wide deployment", "UX Research", "Leadership tools"],
  time: "8 months",
  // ... rest of content
};
```

## Adding a New Case Study

1. Create a new file: `data/case-studies/yourcasestudy.ts`
2. Import the type and define your case study:

```typescript
import { CaseStudy } from "./types";

export const yourcasestudy: CaseStudy = {
  id: "yourcasestudy",
  title: "Your Case Study Title",
  outcome: "Brief outcome statement",
  tags: ["Tag1", "Tag2", "Tag3"],
  time: "X months",
  impact: [
    "Impact point 1",
    "Impact point 2",
  ],
  preview: {
    problem: "What problem existed?",
    myRole: "What was your role?",
    move: "What was the strategic move?",
  },
  fullContent: {
    executiveSummary: "...",
    problemStatement: "...",
    // ... add all other sections
  },
};
```

3. Add it to `index.ts`:

```typescript
export { yourcasestudy } from "./yourcasestudy";

export const allCaseStudies: CaseStudy[] = [
  mysquad,
  atlas,
  tesseract,
  logtak,
  yourcasestudy, // Add here
];
```

## Content Sections

Each case study has the following structure:

### Required Fields
- `id`: Unique identifier (used in URLs)
- `title`: Case study title
- `outcome`: Brief outcome statement
- `tags`: Array of tags for categorization
- `time`: Timeline (e.g., "8 months", "30 days to MVP")
- `impact`: Array of impact statements
- `preview`: Short version shown on the list page
  - `problem`: Why it mattered
  - `myRole`: Your role
  - `move`: Strategic move

### Optional Full Content
- `executiveSummary`: Overview of the project
- `problemStatement`: Detailed problem description
- `users`: User information
  - `primary`: Array of primary user types
  - `scale`: Deployment scale
  - `environment`: Operating environment
- `constraints`: Array of constraint objects
  - `title`: Constraint name
  - `description`: Constraint details
- `designStrategy`: Design approach
- `solution`: Solution details
  - `title`: Solution name
  - `description`: Solution overview
  - `steps`: Array of workflow steps
  - `benefits`: Array of benefits
  - `features`: Array of key features
- `additionalCapabilities`: Array of additional features
- `reflection`: Project reflection

## TypeScript Types

All types are defined in `types.ts`. The IDE will provide autocomplete and type checking when editing case studies.

## Import Usage

Components import case studies from the central index:

```typescript
import { allCaseStudies, getCaseStudyById } from "@/data/case-studies";
```

## Best Practices

1. **Be concise**: Keep impact points and lists brief and scannable
2. **Use active voice**: "Deployed across..." not "Was deployed across..."
3. **Focus on outcomes**: Lead with results, not process
4. **Consistent tone**: Professional, direct, achievement-focused
5. **Defense context**: Emphasize mission-critical, high-stakes nature
