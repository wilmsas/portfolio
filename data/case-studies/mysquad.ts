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
      "MySquad was a squad-level analytics and administrative tool deployed across the entire U.S. Army, with a potential user base spanning all enlisted ranks (E-1 through E-7). The product enabled surface-level readiness visibility, task accountability, and a novel QR-based transactional signing system for counseling sessions. The tool supported leadership accountability and readiness tracking and was showcased at AUSA 2021 under SMA Grinston's high-priority initiatives.",
    problemStatement:
      "Junior NCOs needed to quickly access squad-level analytics and perform administrative tasks, but existing processes relied heavily on paper forms, disconnected systems, and manual tracking. This resulted in delayed or inconsistent counseling documentation, poor visibility into squad readiness, and administrative burden that competed with leadership time. The most critical challenge was digitizing counseling interactions without enabling asynchronous 'checkbox' behavior by bad actors or lazy soldiers—we needed to ensure meaningful interactions continued to happen in-person.",
    users: {
      primary: ["Junior NCOs (Counselors)", "Enlisted Soldiers (Counselees)"],
      scale: "Army-wide deployment — potentially every enlisted Soldier (E-1 to E-7)",
      environment: "Mobile-first, high accountability, leadership-sensitive workflows",
    },
    constraints: [
      {
        title: "Counseling Integrity — The Critical Constraint",
        description:
          "Army counseling is intended to be in-person, conversational, and meaningful. Digitizing this process risked enabling asynchronous 'checkbox' behavior, remote sign-offs, and loss of leadership accountability. We had to ensure a way of translating a paper-copy interaction (Counselor and Counselee) to electronic while ensuring these meaningful interactions continually occurred in-person. We explicitly designed against bad-faith usage by lazy soldiers or bad actors.",
      },
    ],
    designStrategy:
      "The core strategy was to translate a paper-based interaction into a digital artifact without digitizing the interaction itself. Counseling must still happen face-to-face; digital tooling should only confirm completion; the system should discourage lazy or bad-faith usage. Conducted regular user interviews and usability sessions with junior NCOs across diverse units (18th ABN, 160th SOAR, 75th Ranger BN) using 1-on-1, focus group, and group interview formats.",
    solution: {
      title: "Transactional Counseling Workflow",
      description:
        "I designed a transactional, in-person signing flow that enforced physical presence while enabling digital records. This solution prevented async completion and ensured both parties were physically present.",
      steps: [
        "Counselor completes the counseling in person",
        "MySquad generates a unique QR code for that specific counseling session",
        "Counselee scans the QR code on their own device",
        "Counselee opens MySquad and signs the counseling with their finger",
        "Counselor signs to finalize the counseling",
      ],
      benefits: [
        "Both parties were physically present",
        "No async completion possible",
        "No post-hoc signatures",
        "Prevented bad-faith usage",
      ],
    },
    additionalCapabilities: [
      "Surface-level readiness statuses with quick access",
      "Task creation, completion tracking, and accountability management",
      "Frontend overhaul with detailed wireframes and high-fidelity prototypes (Figma, Dovetail)",
      "Transitioned to maintenance mode after successful AUSA 2021 debut",
    ],
    reflection:
      "This project demonstrated how UX can enforce values, not just usability. The solution succeeded because it respected institutional intent while still modernizing delivery. Working closely with developers and stakeholders, we delivered a seamless frontend overhaul that proved its reliability and user acceptance. The application's success at AUSA 2021 under SMA Grinston's priority initiatives validated our user-centric approach.",
  },
};
