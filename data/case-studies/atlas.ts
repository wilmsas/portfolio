import { CaseStudy } from "./types";

export const atlas: CaseStudy = {
  id: "atlas",
  title: "Atlas — Multinational Logistics Dashboards",
  outcome: "Secure, real-time logistics visibility across NATO and U.S. systems",
  tags: ["Defense", "NATO", "Classified systems", "Logistics"],
  time: "30 days to MVP",
  impact: [
    "Deployed across USAREUR-AF and NATO logistics environments",
    "Supports decision-making in TOCs and COICs across Germany and partner nations",
    "Strict one-way data connection (NATO → U.S.) maintained security boundaries",
    "Actively used to support senior-level operational decisions",
  ],
  preview: {
    problem:
      "Logistics visibility was fragmented across American and NATO classified systems, limiting operational decision-making.",
    myRole:
      "UX architecture + cross-domain constraints + rapid prototyping.",
    move:
      "Delivered an MVP in under 30 days despite multinational, classified, and cross-domain constraints by focusing on trusted visibility without compromising security.",
  },
  fullContent: {
    executiveSummary:
      "Atlas was a secure logistics dashboard deployed across USAREUR-AF and NATO, providing real-time visibility into allied supply systems. It bridged American and NATO classified environments using a strict one-way data connection, enabling senior leaders to make informed decisions during active exercises.",
    problemStatement:
      "Before Atlas, NATO logistics data lacked reliable visibility inside U.S. systems. Systems were siloed across nations, and senior leaders lacked timely, trustworthy insights during exercises. The challenge was not just visualization — it was secure integration under classified constraints.",
    users: {
      primary: [
        "Senior logistics planners",
        "Commanders operating within TOCs and COICs",
      ],
      scale: "Entire USAREUR-AF, NATO logistics systems",
      environment: "Used across Germany and partner nations",
    },
    constraints: [
      {
        title: "Technical & Security Constraints",
        description:
          "Bridging U.S. classified systems with NATO classified systems, enforcing a one-way data flow (NATO → U.S. only), operating within SCIF and CPCE environments. Failure was not an option.",
      },
    ],
    designStrategy:
      "The design strategy focused on trustworthy data presentation, clear separation of system boundaries, and supporting decision-making at the highest levels. When live environments were unavailable, high-fidelity prototypes became the primary validation tool.",
    solution: {
      title: "MVP Under Pressure",
      description:
        "The team delivered a working MVP in under 30 days, successfully establishing the one-way NATO → U.S. data pipeline. This timeline is significant given classification boundaries, multinational coordination, and security review requirements.",
      features: [
        "Database-grounded list views for raw analysis",
        "Dashboards and map views for operational insight",
        "Administrative tooling for managing data connections",
      ],
    },
    reflection:
      "Atlas demonstrates how UX can succeed even when systems are fragmented, constraints are non-negotiable, and speed and correctness both matter.",
  },
};
