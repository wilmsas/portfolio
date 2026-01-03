/**
 * Design Strategist Skills
 *
 * Skills for strategists who bridge design and business/product strategy.
 * These competencies focus on aligning design work to business outcomes,
 * leading vision-setting, managing stakeholders, and driving data-informed
 * decision-making.
 *
 * Includes: Frontend dev, Vision setting, Roadmapping, Data analysis,
 * Artifact creation, Business alignment, and Stakeholder management.
 */

import { Skill, createSkill } from "./types";

export const strategistSkills: Skill[] = [
  createSkill("frontend-dev", "Frontend dev", {
    1: {
      title: "Understand constraints",
      description: "Learners understand how UI gets built and what trade-offs exist between design intent and implementation. They can talk through component reuse and basic responsive behavior. Example: they ask engineering about table virtualization or component limits before finalizing a layout.",
      bullets: ["Knows basic frontend concepts (components, states, responsiveness).", "Uses the design system and understands what is reusable.", "Asks implementation questions early to avoid rework."],
    },
    2: {
      title: "Write buildable specs",
      description: "Juniors produce clearer specs and collaborate in handoff to ensure designs are buildable. They can adjust for technical constraints without losing user intent. Example: they annotate interaction states and confirm feasibility during refinement.",
      bullets: ["Creates specs for states, interactions, and responsive behavior.", "Collaborates with engineers to validate feasibility.", "Updates designs quickly based on implementation feedback."],
    },
    3: {
      title: "Partner in delivery",
      description: "Practitioners partner deeply with frontend engineers, catching edge cases and ensuring quality through build and QA. Example: they review PR previews, identify mismatched spacing/focus behavior, and propose concrete fixes.",
      bullets: ["Reviews builds against intent and spots UX defects early.", "Specifies edge cases and error handling clearly.", "Works with engineers to resolve issues and maintain quality."],
    },
    4: {
      title: "Lead technical alignment",
      description: "Advanced strategists mentor others on technical literacy and lead alignment on patterns and constraints. Example: they help standardize a pattern for form validation and coach teams on consistent implementation.",
      bullets: ["Mentors designers on implementation-aware design decisions.", "Leads alignment on patterns that reduce engineering churn.", "Balances technical feasibility with user outcomes and accessibility."],
    },
    5: {
      title: "Set scalable practices",
      description: "Experts influence cross-team UI implementation practices and help shape design system and governance decisions. Example: they coordinate a component strategy that improves consistency and reduces duplication across products.",
      bullets: ["Shapes design system evolution with engineering partners.", "Establishes scalable handoff and quality practices across teams.", "Mentors leaders on technical trade-offs and long-term maintainability."],
    },
  }, "Technical"),
  createSkill("vision-setting", "Vision setting", {
    1: {
      title: "Understand vision artifacts",
      description: "Learners can describe what an experience vision is and why it matters. They can contribute inputs like user goals and pain points. Example: they help draft a simple north-star statement for a feature area.",
      bullets: ["Understands vision vs roadmap vs requirements.", "Contributes user needs and constraints to vision discussions.", "Can restate a vision in plain language."],
    },
    2: {
      title: "Draft a usable north star",
      description: "Juniors help draft vision statements and simple principles that guide decisions. Example: they create a one-page vision for onboarding and use it to evaluate design options.",
      bullets: ["Writes a clear vision statement with outcomes and users.", "Creates 3–5 principles to guide trade-offs.", "Uses the vision to evaluate options during critique."],
    },
    3: {
      title: "Align teams around vision",
      description: "Practitioners lead vision work for a product area and translate it into decision-making tools. Example: they produce a vision deck and run alignment sessions with PM/eng to agree on direction.",
      bullets: ["Leads vision creation for a defined product area.", "Runs alignment sessions and resolves major conflicts.", "Translates vision into principles and success measures."],
    },
    4: {
      title: "Drive vision adoption",
      description: "Advanced strategists mentor others on vision framing and drive adoption across squads. Example: they connect multiple team roadmaps to a shared north star and keep decisions consistent.",
      bullets: ["Mentors teams on crafting and using visions.", "Ensures visions are used in planning and trade-offs.", "Connects visions across initiatives to reduce fragmentation."],
    },
    5: {
      title: "Set portfolio direction",
      description: "Experts shape portfolio-level experience direction and coach leaders on sustaining vision through change. Example: they define an enterprise experience strategy and governance model that survives reorganizations.",
      bullets: ["Influences portfolio strategy through experience vision.", "Coaches leaders on sustaining direction across change.", "Establishes governance for vision, principles, and measurement."],
    },
  }, "Strategy"),
  createSkill("roadmapping", "Roadmapping", {
    1: {
      title: "Roadmap basics",
      description: "Learners understand what a roadmap communicates and how sequencing affects outcomes. Example: they can explain dependencies between discovery, design, and build steps.",
      bullets: ["Understands sequencing and dependencies at a basic level.", "Can identify what must come first and why.", "Participates in planning discussions with guidance."],
    },
    2: {
      title: "Contribute to sequencing",
      description: "Juniors propose sequencing and scope cuts based on user impact. Example: they recommend delivering a simplified flow first to reduce risk and learn faster.",
      bullets: ["Suggests sequencing based on impact and risk.", "Identifies scope cuts that preserve user value.", "Communicates dependencies and constraints clearly."],
    },
    3: {
      title: "Own experience roadmap inputs",
      description: "Practitioners own UX inputs into the roadmap and align trade-offs with stakeholders. Example: they propose a phased plan that balances quick wins with foundational fixes.",
      bullets: ["Defines phased delivery plans tied to user outcomes.", "Aligns stakeholders on trade-offs and rationale.", "Keeps roadmap connected to evidence and measurement."],
    },
    4: {
      title: "Lead roadmap alignment",
      description: "Advanced strategists lead cross-team alignment and mentor others on planning discipline. Example: they run roadmap workshops that reconcile competing priorities and produce clear commitments.",
      bullets: ["Leads roadmap workshops and resolves conflicts.", "Mentors others on scope, sequencing, and decision hygiene.", "Uses evidence to challenge priority assumptions."],
    },
    5: {
      title: "Set roadmap standards",
      description: "Experts set standards for how experience roadmaps are built and used across teams. Example: they establish portfolio-level planning rituals and measures of progress.",
      bullets: ["Establishes roadmap practices and governance at scale.", "Coaches leaders on planning trade-offs and outcome focus.", "Aligns portfolio investments to experience strategy."],
    },
  }, "Strategy"),
  createSkill("data-analysis", "Data analysis", {
    1: {
      title: "Read data with guidance",
      description: "Learners can interpret basic charts and recognize obvious anomalies. Example: they notice a spike in errors after a release and flag it for investigation.",
      bullets: ["Reads charts and dashboards with support.", "Recognizes obvious anomalies and data gaps.", "Asks clarifying questions about definitions and sources."],
    },
    2: {
      title: "Basic analysis for decisions",
      description: "Juniors perform simple analyses to support decisions, like comparing segments or time windows. Example: they identify that a new UI performs worse for mobile users and propose hypotheses.",
      bullets: ["Compares segments and time periods appropriately.", "Connects changes to plausible hypotheses.", "Documents assumptions and data limitations."],
    },
    3: {
      title: "Decision-ready insights",
      description: "Practitioners produce analysis that informs prioritization and iteration. Example: they combine funnel metrics with support data to target the biggest pain point.",
      bullets: ["Builds insights that connect metrics to user behavior.", "Triangulates with other signals (support, qual).", "Communicates findings clearly with implications."],
    },
    4: {
      title: "Lead insight strategy",
      description: "Advanced strategists lead analysis approaches and mentor others on rigor and interpretation. Example: they define an initiative scorecard and teach teams how to use it.",
      bullets: ["Defines scorecards and insight workflows for teams.", "Mentors others on rigorous interpretation and caveats.", "Guides decisions with clear trade-off narratives."],
    },
    5: {
      title: "Influence leadership with evidence",
      description: "Experts influence leadership using deep, multi-source analysis and set standards for insight quality. Example: they create portfolio-level reporting that drives investment shifts.",
      bullets: ["Sets standards for analysis quality and storytelling.", "Advises leaders with clear recommendations and risks.", "Builds mentorship to improve org data literacy."],
    },
  }, "Research & Insights"),
  createSkill("artifact-creation", "Artifact creation", {
    1: {
      title: "Create basic artifacts",
      description: "Learners create simple artifacts like notes, summaries, and basic flows with guidance. Example: they document a current-state journey from interviews.",
      bullets: ["Produces clear notes and simple summaries.", "Creates basic diagrams (flows, journeys) with guidance.", "Keeps artifacts organized and shareable."],
    },
    2: {
      title: "Useful decision artifacts",
      description: "Juniors create artifacts that help teams align, like journeys, service maps, or briefs. Example: they produce a journey map that highlights top pain points and opportunities.",
      bullets: ["Creates artifacts that clarify problems and options.", "Synthesizes inputs into a coherent story.", "Keeps artifacts updated as decisions change."],
    },
    3: {
      title: "Drive action with artifacts",
      description: "Practitioners create lean artifacts designed to drive decisions and next steps. Example: they write an experience brief that aligns scope, constraints, and success measures.",
      bullets: ["Creates briefs/models that drive concrete decisions.", "Connects artifacts to owners, actions, and timelines.", "Balances depth with speed—no shelfware."],
    },
    4: {
      title: "Standardize and mentor",
      description: "Advanced strategists mentor others on creating high-signal artifacts and standardize templates. Example: they introduce a strategy brief template used across squads.",
      bullets: ["Mentors others on artifact quality and relevance.", "Standardizes templates and repositories for reuse.", "Ensures artifacts lead to action and measurement."],
    },
    5: {
      title: "Scale organizational clarity",
      description: "Experts establish org-wide artifact practices and coach leaders on using them. Example: they create a portfolio narrative framework used in planning and reviews.",
      bullets: ["Sets standards for decision artifacts across teams.", "Coaches leaders on using artifacts in governance.", "Builds systems that keep knowledge current and accessible."],
    },
  }, "Research & Insights"),
  createSkill("business-alignment", "Business alignment", {
    1: {
      title: "Understand business goals",
      description: "Learners understand basic business objectives and constraints affecting design. Example: they can explain how a design change might affect support load or compliance risk.",
      bullets: ["Understands basic business outcomes and constraints.", "Identifies key stakeholders and goals with guidance.", "Asks how success is measured and why it matters."],
    },
    2: {
      title: "Connect UX to outcomes",
      description: "Juniors connect UX work to business impact in their communication. Example: they justify simplifying a flow by pointing to reduced abandonment and fewer support tickets.",
      bullets: ["Frames design decisions in terms of outcomes.", "Balances user needs with constraints (policy, cost).", "Communicates trade-offs clearly in reviews."],
    },
    3: {
      title: "Own outcome framing",
      description: "Practitioners lead outcome framing for initiatives and align teams on value and feasibility. Example: they propose a phased approach that delivers value while managing risk.",
      bullets: ["Defines value hypotheses and success measures with partners.", "Aligns scope to feasibility and business constraints.", "Uses evidence to support prioritization decisions."],
    },
    4: {
      title: "Lead alignment across functions",
      description: "Advanced strategists lead alignment across stakeholders and mentor others on outcome-driven framing. Example: they negotiate priorities between security, eng, and product to protect user value.",
      bullets: ["Leads multi-stakeholder alignment and negotiation.", "Mentors others on business framing and trade-offs.", "Anticipates risks and sets mitigation plans."],
    },
    5: {
      title: "Influence strategy and investment",
      description: "Experts influence strategy and investment decisions by tying experience to business outcomes. Example: they build a business case for foundational UX work and secure funding.",
      bullets: ["Advises leadership on experience investments and ROI.", "Sets standards for outcome framing and measurement.", "Mentors teams on strategic business alignment."],
    },
  }, "Business"),
  createSkill("stakeholder-mgmt", "Stakeholder management", {
    1: {
      title: "Stakeholder basics",
      description: "Learners identify key stakeholders and keep them informed with guidance. Example: they provide updates and ask clarifying questions during reviews.",
      bullets: ["Identifies stakeholders and their interests.", "Communicates status and asks for input appropriately.", "Documents feedback and decisions."],
    },
    2: {
      title: "Manage expectations",
      description: "Juniors manage expectations by sharing options, constraints, and timelines. Example: they present two design options with trade-offs and get a decision.",
      bullets: ["Communicates trade-offs and constraints clearly.", "Gathers feedback and closes loops on decisions.", "Builds trust through reliability and follow-through."],
    },
    3: {
      title: "Drive decisions",
      description: "Practitioners drive stakeholder decisions through structured communication and evidence. Example: they run a review that ends with a clear decision and documented rationale.",
      bullets: ["Leads reviews that land decisions and owners.", "Uses evidence to resolve disagreements.", "Maintains decision logs and follows up on actions."],
    },
    4: {
      title: "Lead complex stakeholder landscapes",
      description: "Advanced strategists handle competing priorities and mentor others on influence. Example: they reconcile conflicting requirements across leadership groups and keep progress moving.",
      bullets: ["Navigates conflict and ambiguity with calm influence.", "Mentors others on stakeholder mapping and comms.", "Creates alignment by making trade-offs explicit."],
    },
    5: {
      title: "Coach leaders and set governance",
      description: "Experts coach leaders and establish governance practices that reduce churn and rework. Example: they implement decision cadences and escalation paths across a program.",
      bullets: ["Establishes governance and decision cadences.", "Coaches leaders on alignment and communication.", "Builds systems that prevent repeated debates and drift."],
    },
  }, "Business"),
];
