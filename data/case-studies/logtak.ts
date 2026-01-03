import { CaseStudy } from "./types";

export const logtak: CaseStudy = {
  id: "logtak",
  title: "LOGTAK — TAK-Based Supply Integration",
  outcome: "Real-time logistics reporting from squad to battalion",
  tags: ["Defense", "Tactical UX", "ATAK integration", "Field operations"],
  time: "Deployment to 2CR, Vilseck",
  impact: [
    "Enabled squad leaders to submit LOGSTAT reports directly from ATAK devices",
    "Progressive review and aggregation from squad → platoon → company → battalion",
    "Designed within deprecated Android environment and TAK UI constraints",
    "Demonstrated effective UX in austere, high-pressure tactical environments",
  ],
  preview: {
    problem:
      "Infantry units lacked real-time supply visibility, and existing systems couldn't integrate with tactical Android devices.",
    myRole:
      "UX design + tactical constraints + rapid deployment.",
    move:
      "Built LOGSTAT reporting directly into ATAK, enabling squad-level data capture that aggregated upward while maintaining speed and operational clarity in constrained environments.",
  },
  fullContent: {
    executiveSummary:
      "LOGTAK enabled real-time logistics reporting from infantry squads using ATAK, aggregating supply data through platoon, company, and battalion levels to support operational decision-making.",
    problemStatement:
      "Logistics reporting was manual, slow to aggregate, and poorly aligned with infantry workflows. Leaders needed real-time insight without slowing operations.",
    users: {
      primary: [
        "Squad leaders",
        "Platoon leaders",
        "Company commanders",
        "Battalion staff",
      ],
      scale: "2CR (Vilseck, Germany)",
      environment: "Squad → Platoon → Company → Battalion aggregation",
    },
    constraints: [
      {
        title: "Technical Constraints",
        description:
          "ATAK Android environment with deprecated tooling, non-standard design systems, and extreme emphasis on speed and lethality. This required abandoning modern web assumptions.",
      },
    ],
    designStrategy:
      "The strategy centered on respecting infantry workflows, minimizing interaction cost, and ensuring aggregation mirrored command structure.",
    solution: {
      title: "ATAK-Native Integration",
      features: [
        "ATAK-native LOGSTAT submission",
        "Hierarchical aggregation (Squad → PLT → CO → BN)",
        "UI patterns optimized for speed under pressure",
      ],
    },
    reflection:
      "LOGTAK reinforced that good UX is context-dependent — especially in environments where speed, clarity, and lethality matter more than polish.",
  },
};
