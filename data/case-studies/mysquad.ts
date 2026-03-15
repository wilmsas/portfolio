import { CaseStudy } from "./types";

export const mysquad: CaseStudy = {
  id: "mysquad",
  title: "MySquad",
  outcome: "Digitizing squad leadership without losing what makes it human",
  tags: ["Defense", "Army-wide Deployment", "UX Research", "Product Design", "Leadership Tools"],
  time: "8 months",
  impact: [],
  preview: {
    problem:
      "Squad leaders were drowning in paper-based admin: counseling on DA 4856, manual accountability, disconnected readiness data. No mobile tool matched how they actually operate.",
    myRole:
      "UX strategy + research + interaction design, from discovery interviews through AUSA 2021 debut.",
    move:
      "Designed a QR-based transactional signing flow that enforced in-person counseling without a single external dependency.",
  },
  fullContent: {
    problemStatement:
      "Squad leaders manage people, not systems. But the systems they were stuck with forced them into an administrative role that competed directly with their leadership time.\n\nCounseling, a mandatory monthly conversation between NCOs and their Soldiers, lived entirely on paper. DA Form 4856 had to be filled out by hand, signed in person, and physically filed. Accountability was a mental exercise: who's present, who's on leave, who's TDY. Readiness data was scattered across disconnected systems that squad leaders rarely had time to check.\n\nThe result was predictable. Counselings were late, inconsistent, or skipped entirely. Accountability was informal and unreliable. Leaders spent their limited time on paperwork instead of people.",
    users: {
      primary: [
        "Junior NCOs (Counselors): team leaders and squad leaders responsible for monthly counseling, daily accountability, and task management for their Soldiers.",
        "Enlisted Soldiers (Counselees): the recipients of counseling sessions who needed to review, acknowledge, and sign documentation.",
      ],
      scale: "Army-wide: every enlisted Soldier, E-1 through E-7",
      environment:
        "Mobile-first by necessity. Squad leaders operate in motor pools, field environments, and barracks. Not behind desks. Any solution had to work on a phone, in low-connectivity conditions, and fit into the pace of a squad leader's day. Every workflow was leadership-sensitive: these tools touch trust, accountability, and careers.",
    },
    constraints: [],
    brief:
      "The Sergeant Major of the Army had a simple directive: \"Make a kick-ass app for squad leaders.\" That became our north star.\n\nMySquad was built at the Army Software Factory to give junior NCOs a mobile tool for the things that eat their time: tracking squad readiness, managing tasks, and conducting counseling sessions. It was deployed across the entire U.S. Army, covering every enlisted rank from E-1 through E-7, and showcased at AUSA 2021 as a flagship product under SMA Grinston's \"This is My Squad\" initiative.\n\nThe hardest design problem wasn't building the tool. It was digitizing a deeply human interaction (counseling) without destroying what made it meaningful.",
    discovery: {
      description:
        "We started broad. If the SMA wanted a \"kick-ass app for squad leaders,\" we needed to understand what actually made their days painful. Not what senior leaders assumed the problems were.\n\nWe conducted over 15 user interviews and usability sessions across a range of unit types: infantry, signal, maintenance, and others, using a mix of 1-on-1 interviews, focus groups, and group sessions. The diversity of units was intentional. A squad leader's pain points in an infantry company look different from those in a signal battalion, but the administrative burden is universal.",
      keyInsight:
        "Squad leaders didn't need another dashboard. They needed their administrative burden reduced so they could spend more time leading. The management layer (counseling, accountability, tasking) was the highest-friction area across every unit type we spoke with.",
    },
    criticalConstraint: {
      description:
        "Army counseling is not a form. It's a face-to-face conversation between a leader and their Soldier, intended to be personal, developmental, and meaningful. The paper form (DA 4856) is just the record of that conversation. Digitizing the form was straightforward. The real risk was that digitizing the record would inadvertently digitize the interaction, enabling NCOs to skip the conversation entirely and just fill out a form on their phone.",
      tension:
        "We had to translate a paper-based artifact into a digital one without digitizing the interaction itself. The system needed to confirm that a meaningful conversation happened. Not replace it.",
    },
    counselingFlow: {
      intro:
        "The counseling feature was the heart of MySquad. We designed the complete workflow to mirror the structure of the DA 4856 while adding digital conveniences: template selection, SMART goal creation, and exportable signed PDFs. All without allowing asynchronous completion.",
      phases: [
        {
          phase: "Phase 1: Initiation & Setup",
          description:
            "The counselor creates a new session, choosing from a blank form, a template based on common counseling topics, or a specific type (Performance, Professional Growth, Event-Oriented). Type selection happens upfront so the right structure is scaffolded before any data entry begins.",
          imageKey: "counseling_entry",
          caption:
            "Counseling creation → type selection → soldier search → administrative data & background information",
        },
        {
          phase: "Phase 2: Session Setup & Soldier Selection",
          description:
            "The counselor searches for and selects the Soldier. Administrative data auto-populates from the roster. No manual entry. Background information surfaces readiness metrics (ACFT scores, weapons qualification, DLC status) directly into the counseling context, giving the leader what they need before the conversation starts.",
          imageKey: "session_setup",
          caption:
            "Soldier search → administrative data auto-populated → background info with readiness data surfaced",
        },
        {
          phase: "Phase 3: Documenting the Conversation",
          description:
            "The full counseling session mirrors the DA 4856 structure exactly. The counselor documents key points and builds a plan of action. A guided SMART goal wizard walks through each dimension (Specific, Measurable, Attainable, Relevant, Timely) so goals are structured, not vague. The completed session shows both signatures and is ready for export.",
          imageKey: "session_content",
          caption:
            "Full session mirrors DA 4856 → guided SMART goal creation → completed session with signatures",
        },
      ],
    },
    qrHandshake: {
      description:
        "The most critical design decision in the entire project was how we handled signatures. We needed a mechanism that proved both parties were physically present, without purchasing external services like DocuSign and while working within the constraints of a government web app.\n\nWe built a custom solution from scratch:",
      steps: [
        "Counselor completes the session. The in-person conversation happens, documented in MySquad during or after.",
        "MySquad generates a unique QR code tied to that counseling record, valid only for that interaction. It cannot be reused or shared.",
        "Counselee scans on their own device. The Soldier opens the counseling session in MySquad on their phone, which requires physical proximity.",
        "Both parties sign with a custom signature block built from scratch, finger-drawn directly on their own devices.",
        "Signed DA 4856 is generated and downloadable, with every field compiled into an official PDF ready to file.",
      ],
      imageKey: "qr_handshake",
      callout:
        "This wasn't just a digital convenience. It was an integrity mechanism. The QR handshake made it impossible to complete a counseling asynchronously. No remote sign-offs. No post-hoc signatures. No checkbox counselings. The system enforced the Army's intent that counseling be a meaningful, face-to-face interaction, while still giving leaders the efficiency of digital records.",
    },
    accountability: {
      description:
        "The second major feature addressed the other universal pain point from research: knowing where your people are. Squad leaders needed a fast, mobile way to track daily accountability: who's present, who's TDY, who's on leave, who's on sick call.\n\nWe designed a lightweight flow: the squad leader creates an accountability event, pushes a notification to their squad, and collects status responses via SMS text reply. The totals view gives an accurate status picture in real time, ready to relay up the chain.",
      imageKey: "accountability",
      caption: "Create accountability event → squad receives push notification → squad leader totals view",
    },
    metrics: [
      { value: "Army-wide", label: "Deployed across every enlisted rank, E-1 to E-7" },
      { value: "AUSA 2021", label: "Showcased as a flagship SMA initiative" },
      { value: "First", label: "Mobile-native counseling with official DA 4856 PDF export" },
      { value: "Zero", label: "External dependencies for signing. Custom-built signature system." },
    ],
    images: {
      counseling_entry: "/images/case-studies/mysquad/01_counseling_entry.png",
      session_setup: "/images/case-studies/mysquad/02_session_setup.png",
      session_content: "/images/case-studies/mysquad/03_session_content.png",
      qr_handshake: "/images/case-studies/mysquad/04_qr_signatures.png",
      accountability: "/images/case-studies/mysquad/05_accountability.png",
    },
    meta: {
      role: "Product Designer",
      scale: "Army-wide (E-1 – E-7)",
    },
    reflection:
      "MySquad taught me that the hardest design problems aren't about interfaces. They're about values. The counseling workflow succeeded because we refused to treat digitization as a feature request. We treated it as a trust problem: how do you give leaders a better tool without giving bad actors an easier shortcut?\n\nThe answer was designing accountability into the system itself. The QR handshake wasn't a technical flex. It was a direct response to what NCOs told us they were afraid of. That feedback loop, from research insight to design constraint to novel solution, is the part of this project I'm most proud of.\n\nMySquad deployed Army-wide, covering every enlisted Soldier from E-1 through E-7. It was the first mobile-native counseling tool with official DA 4856 PDF export, built entirely without external dependencies for the signing system. The project was showcased at AUSA 2021 as a flagship product under SMA Grinston's \"This is My Squad\" initiative.\n\nWorking at the Army Software Factory also shaped how I think about scale. Designing for every squad leader in the Army means designing for wildly different contexts, technical literacy levels, and leadership cultures. The solution had to be simple enough for everyone and robust enough for the edge cases.",
  },
};
