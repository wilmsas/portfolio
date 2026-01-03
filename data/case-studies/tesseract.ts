import { CaseStudy } from "./types";

export const tesseract: CaseStudy = {
  id: "tesseract",
  title: "Tesseract — Internal Starter App Framework",
  outcome: "Reducing product startup time across the Army Software Factory",
  tags: ["Design systems", "Internal tools", "Enablement", "Standardization"],
  time: "Ongoing framework",
  impact: [
    "Reduced typical startup timelines from six months to four weeks",
    "Standardized boilerplate capabilities across teams",
    "Introduced two mission-aligned design systems",
    "Became foundational infrastructure for new products",
  ],
  preview: {
    problem:
      "Teams were repeatedly rebuilding foundational features, delaying delivery and creating inconsistent user experiences.",
    myRole:
      "Strategy + design system architecture + enablement.",
    move:
      "Created standardized boilerplate and design systems that became the fastest path from concept to MVP, eliminating redundant work.",
  },
  fullContent: {
    executiveSummary:
      "Tesseract was an internal enablement project that drastically reduced application startup time across the Army Software Factory by introducing standardized boilerplate features and two mission-aligned design systems.",
    problemStatement:
      "Teams were taking months to spin up new applications due to repeated reinvention of basic features, inconsistent UX patterns, and lack of shared design foundations. This slowed delivery and diluted quality.",
    users: {
      primary: ["Internal product teams", "Designers and developers"],
      scale: "Internal, but foundational to every product",
    },
    designStrategy:
      "Instead of a single rigid system, we introduced two design systems aligned to different mission sets with opinionated defaults and flexibility. This balanced speed with operational fit.",
    solution: {
      title: "Platform Enablement",
      features: [
        "Boilerplate application features",
        "Shared interaction patterns",
        "Design systems ready for immediate adoption",
      ],
    },
    reflection:
      "This work emphasized platform thinking over product thinking, ensuring long-term leverage rather than one-off wins.",
  },
};
