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
      "Atlas was a SCIF-secure, MPE-based, real-time dashboard solution deployed across USAREUR-AF and NATO logistics environments. It bridged USAREUR-AF's internal logistics data with NATO's proprietary LOGFAS system, providing secure, customizable dashboards within a CPCE environment. The solution enabled senior leaders to make informed decisions during active exercises while maintaining strict cross-domain security protocols.",
    problemStatement:
      "Prior to Atlas, USAREUR-AF did not have reliable visibility into allied host nation supply systems and statuses. NATO logistics data lacked visibility inside U.S. systems. Systems were siloed across nations, and senior leaders lacked timely, trustworthy insights during Europe-wide exercises. The challenge was not just visualization — it was secure integration of American and NATO classified systems under strict cross-domain constraints.",
    users: {
      primary: [
        "Senior logistics planners",
        "Commanders operating within TOCs and COICs",
        "4-star level decision-makers",
      ],
      scale: "Entire USAREUR-AF and NATO logistics systems across Germany and partner nations",
      environment: "SCIF and CPCE environments during active multinational exercises",
    },
    constraints: [
      {
        title: "Cross-Domain Security — One-Way Data Flow",
        description:
          "Bridging U.S. classified systems with NATO classified systems while enforcing a strict one-way data flow (NATO → U.S. only). Operating within SCIF and CPCE environments with no room for security compromise. This was extremely difficult to create — we had to ensure data integrity while maintaining the security boundary. Failure was not an option.",
      },
      {
        title: "No Live Staging Environment",
        description:
          "Deploying our plug-in in Germany from the USA prevented access to a live staging environment. This required highly detailed prototypes that emulated real-world experiences and scenarios, enabling realistic user testing without production access.",
      },
    ],
    designStrategy:
      "The design strategy focused on trustworthy data presentation, clear separation of system boundaries, and supporting rapid decision-making at the 4-star level. When live environments were unavailable, I created highly detailed prototypes that provided near-production simulations for effective feedback collection. The design balanced user-friendly interfaces with stringent data integrity and security requirements.",
    solution: {
      title: "MVP Under Pressure — 30-Day Delivery",
      description:
        "The team delivered a working MVP in under 30 days, successfully establishing the one-way NATO → U.S. data pipeline. This timeline is HUGE given classification boundaries, multinational coordination, and security review requirements. Operating within a SCIF required real-time design revisions under extreme pressure.",
      features: [
        "Database-grounded list views for raw data analysis with sorting and filtering by supply classes (Class I, Class II, etc.)",
        "Dynamic dashboards and map views enabling tactical decision-making with user-created, unit-specific data and geographic information",
        "Admin interface to manage and rework data connections",
        "Secure integration with NATO's LOGFAS system",
        "Real-time updates during active exercises",
      ],
    },
    additionalCapabilities: [
      "Rapid iteration during active exercises — revised frontend designs and deployed new features in under 90 minutes from the back of a SUV",
      "Further integrations underway with MAVEN to enhance supply mission execution",
      "Customizable dashboards for different command levels",
    ],
    reflection:
      "Atlas has become a critical tool during Europe-wide exercises. Its secure integration with LOGFAS and dynamic visualizations support rapid, informed decision-making at the 4-star level while maintaining compliance with data integrity and security requirements. This project demonstrated our capability to balance operational demands with user-friendly interfaces in high-pressure, secure environments. Working within a SCIF added complexity, but we consistently delivered high-quality design revisions in real time. Atlas proves that UX can succeed even when systems are fragmented, constraints are non-negotiable, and speed and correctness both matter.",
  },
};
