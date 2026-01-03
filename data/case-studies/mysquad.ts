import { CaseStudy } from "./types";

export const mysquad: CaseStudy = {
  id: "mysquad",
  title: "MySquad — Squad Analytics & Counseling Tool",
  outcome: "Army-wide leadership enablement at scale",
  tags: ["Defense", "Army-wide deployment", "UX Research", "Leadership tools"],
  time: "8 months",
  impact: [
    "Deployed across entire U.S. Army (E-1 through E-7)",
    "Modernized squad-level readiness tracking and task accountability",
    "Novel QR-based counseling flow ensured face-to-face integrity",
    "Showcased at AUSA 2021 under SMA Grinston's priority initiatives",
  ],
  preview: {
    problem:
      "Squad-level readiness tracking and counseling workflows were outdated, while digital solutions risked undermining in-person leadership interactions.",
    myRole:
      "UX strategy + interaction design + research (aligned Army leadership requirements with soldier workflows).",
    move:
      "Created a transactional, QR-based counseling flow that enforced face-to-face completion, preventing asynchronous or bad-faith usage while preserving digital record-keeping.",
  },
  fullContent: {
    executiveSummary:
      "MySquad was a squad-level analytics and administrative tool deployed across the entire U.S. Army, with a potential user base spanning all enlisted ranks (E-1 through E-7). The product enabled readiness visibility, task accountability, and a novel in-person digital counseling workflow that preserved the integrity of face-to-face leadership interactions while modernizing record-keeping.",
    problemStatement:
      "Squad leaders are expected to maintain readiness, accountability, and counseling records, yet existing processes relied heavily on paper forms, disconnected systems, and manual tracking. This resulted in delayed or inconsistent counseling documentation, poor visibility into squad readiness, and administrative burden that competed with leadership time. The most critical challenge was digitizing counseling interactions without undermining their in-person, leadership-driven nature.",
    users: {
      primary: ["Junior NCOs (Counselors)", "Enlisted Soldiers (Counselees)"],
      scale: "Army-wide deployment — potentially every enlisted Soldier (E-1 to E-7)",
      environment: "Mobile-first, high accountability, leadership-sensitive workflows",
    },
    constraints: [
      {
        title: "Counseling Integrity",
        description:
          "Army counseling is intended to be in-person, conversational, and meaningful. Digitizing this process risked enabling asynchronous 'checkbox' behavior, remote sign-offs, and loss of leadership accountability. We explicitly designed against these failure modes.",
      },
    ],
    designStrategy:
      "The core strategy was to translate a paper-based interaction into a digital artifact without digitizing the interaction itself. Counseling must still happen face-to-face; digital tooling should only confirm completion; the system should discourage lazy or bad-faith usage.",
    solution: {
      title: "Transactional Counseling Workflow",
      description:
        "I designed a transactional, in-person signing flow that enforced physical presence while enabling digital records.",
      steps: [
        "Counselor completes the counseling in person",
        "MySquad generates a unique QR code for that specific counseling",
        "Counselee scans the QR code on their own device",
        "Counselee signs using their finger",
        "Counselor signs to finalize the counseling",
      ],
      benefits: [
        "Both parties were physically present",
        "No async completion",
        "No post-hoc signatures",
      ],
    },
    additionalCapabilities: [
      "Squad-level readiness overview",
      "Task creation, assignment, and accountability tracking",
    ],
    reflection:
      "This project demonstrated how UX can enforce values, not just usability. The solution succeeded because it respected institutional intent while still modernizing delivery.",
  },
};
