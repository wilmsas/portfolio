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
      "Tesseract was an internal enablement project that drastically reduced application startup time across the Army Software Factory by introducing standardized boilerplate features and two mission-aligned design systems. The goal was to enable teams to start new projects quickly while maintaining consistency, high usability, and security without compromising quality.",
    problemStatement:
      "Teams at the Army Software Factory were taking months (typically six months) to spin up new applications due to repeated reinvention of basic features, inconsistent UX patterns, and lack of shared design foundations. This slowed delivery, diluted quality, and created significant friction for teams trying to move from concept to MVP. Every team was essentially starting from scratch, rebuilding foundational functionality that should have been standardized.",
    users: {
      primary: [
        "Internal product teams across Army Software Factory",
        "Designers and developers",
        "Product managers",
      ],
      scale: "Internal, but foundational to every product — Army Software Factory-wide adoption",
    },
    designStrategy:
      "Instead of a single rigid system, we introduced two design systems aligned to different mission sets with opinionated defaults and flexibility. This balanced speed with operational fit. Leveraged agile methodologies to produce detailed wireframes, flow diagrams, and interactive prototypes. Extensive user interviews and testing sessions with internal teams helped capture diverse requirements and pain points, ensuring the final product met operational needs across various mission contexts.",
    solution: {
      title: "Platform Enablement — Two Mission-Aligned Design Systems",
      description:
        "Created a boilerplate application framework that enabled rapid product development while maintaining consistency across teams. The introduction of two distinct design systems allowed teams to select the system that best fit their specific mission requirements.",
      features: [
        "Standardized boilerplate application features ready for immediate use",
        "Two mission-aligned design systems tailored to different operational contexts",
        "Shared interaction patterns and component libraries",
        "Opinionated defaults with flexibility for customization",
        "Security and compliance built-in from the start",
      ],
    },
    additionalCapabilities: [
      "Detailed wireframes and interactive prototypes for rapid iteration",
      "Comprehensive documentation and onboarding materials",
      "Design system adoption support and training",
      "Continuous improvement based on team feedback",
    ],
    reflection:
      "This work emphasized platform thinking over product thinking, ensuring long-term leverage rather than one-off wins. The starter application significantly reduced project setup times from six months to four weeks — a massive improvement that enabled rapid deployment of new products without compromising on security or user experience. Tesseract became foundational infrastructure for the Army Software Factory, proving that investing in shared systems creates exponential value across teams. The project demonstrated how strategic enablement work can transform an entire organization's velocity.",
  },
};
