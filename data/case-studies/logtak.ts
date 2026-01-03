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
      "LOGTAK transformed supply logistics data capture and analysis by integrating TAK devices (ATAK and WINTAK) into the supply chain workflow. It enabled squad leaders to input supply data directly from their ATAK Android devices via a custom TAK plug-in, which was then aggregated up through command echelons (platoon, company, battalion) and integrated with the ATLAS system. The solution provided real-time, actionable logistics data to support mission-critical decision-making.",
    problemStatement:
      "Logistics reporting was manual, slow to aggregate, and poorly aligned with infantry workflows. Infantry units lacked real-time supply visibility, and existing systems couldn't integrate with tactical Android devices. Leaders needed real-time insight without slowing operations. Squad leaders had no efficient way to submit LOGSTAT reports, and battalion-level commanders lacked consolidated supply visibility for informed decision-making.",
    users: {
      primary: [
        "Squad leaders (ATAK mobile devices)",
        "Platoon leaders (review and aggregation)",
        "Company commanders (consolidated review)",
        "Battalion staff (strategic decision-making)",
      ],
      scale: "2CR (Vilseck, Germany) — entire unit deployment",
      environment:
        "Tactical field operations with hierarchical aggregation: Squad → Platoon → Company → Battalion. High-stakes, multinational exercises (e.g., SABER STRIKE).",
    },
    constraints: [
      {
        title: "Deprecated Android Environment — ATAK Integration",
        description:
          "The engineering task was extremely difficult because we had to use ATAK Android app functionality which required entirely different design systems and developing in a deprecated environment. We were working with MUI 2 (deprecated tech) while maintaining lethality and operational speed. This required abandoning modern web assumptions and designing within strict TAK UI constraints with extreme emphasis on speed under pressure.",
      },
      {
        title: "Cross-Domain Data Flows",
        description:
          "Integration challenges involved substantial cross-domain data flows, real-time updates, and working within a highly secure environment. The design had to be robust enough to manage real-time data connectivity issues without compromising data integrity.",
      },
    ],
    designStrategy:
      "The strategy centered on respecting infantry workflows, minimizing interaction cost, and ensuring aggregation mirrored command structure. Conducted in-depth interviews and shadowing sessions with users from squad leaders to brigade commanders to map the end-to-end data collection and aggregation process. This research defined clear user flows for data hand-offs from squad leaders on mobile devices to senior leadership on PCs within TOCs.",
    solution: {
      title: "ATAK-Native Integration with Hierarchical Aggregation",
      description:
        "Created front-end designs that enabled squad leaders to take a LOGSTAT, submit it on their ATAK phones, then have a platoon leader combine their squad leaders' reports, review and submit up to the company level which was reviewed and combined of PLT logstats and submitted for the Battalion level to see and make better decisions based on supply levels.",
      features: [
        "Custom TAK plug-in for ATAK-native LOGSTAT submission from mobile devices",
        "Hierarchical aggregation workflow (Squad → PLT → CO → BN)",
        "Progressive review and combination at each command level",
        "Integration with ATLAS system for comprehensive logistics visibility",
        "UI patterns optimized for speed under operational pressure",
        "Dashboard views for aggregated LOGSTAT data at each echelon",
      ],
    },
    additionalCapabilities: [
      "Rapid iteration during multinational exercises (SABER STRIKE) allowed immediate validation and refinement",
      "Interactive prototypes demonstrated key functionalities including TAK plug-in interface and clear data hand-off flows",
      "Real-time data connectivity with fallback mechanisms",
      "Support for both ATAK and WINTAK devices",
    ],
    reflection:
      "LOGTAK's successful deployment during high-stakes multinational exercises provided real-time, actionable logistics data to support mission-critical decision-making. The product effectively balanced technical integration challenges with a user-friendly design that incorporated on-the-ground use by squads for analysis within high-level Command Centers. This project reinforced that good UX is context-dependent — especially in environments where speed, clarity, and lethality matter more than polish. Working within deprecated technology and austere tactical environments, we proved that effective UX design can succeed even under the most challenging constraints. The integration of TAK data into the broader ATLAS system further amplified the strategic value of our work, making it an exemplary case of user-centric design that delivers on both operational and business fronts.",
  },
};
