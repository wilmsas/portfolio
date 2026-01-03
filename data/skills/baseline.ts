/**
 * Baseline Design Skills
 *
 * Core competencies expected across all design roles. These represent the
 * foundational skills that every designer should develop, regardless of
 * specialty or focus area.
 *
 * Includes: Research, Design thinking, Facilitation, Interface Design,
 * Wireframing, User Flows, Service Design, Information Architecture,
 * UX Strategy, and Agile Methods.
 */

import { Skill, createSkill } from "./types";

export const baselineSkills: Skill[] = [
  createSkill("research", "Research", {
    1: {
      title: "Research foundations",
      description: "Learners know the difference between qualitative and quantitative research and when each is useful. They can help prep a study by writing draft questions, organizing a script, or cleaning a spreadsheet of responses. Example: they sit in on usability sessions, take structured notes, and flag confusing moments for review with a lead.",
      bullets: ["Understands basic methods (interviews, surveys, usability tests) and what each can and cannot answer.", "Helps with recruiting logistics, note‑taking, and organizing raw data into a usable format.", "Can summarize what happened without over‑interpreting or making causal claims."],
    },
    2: {
      title: "Run scoped research with support",
      description: "Juniors can independently execute simple research tasks with guidance on rigor. They can run a lightweight usability test, send a short survey, or do a quick competitive scan and report patterns. Example: they test a new form flow with 5 users, capture top issues, and propose a small set of fixes for the next iteration.",
      bullets: ["Chooses a basic method for a clear question and writes a short plan (goal, participants, tasks, success criteria).", "Synthesizes findings into themes and severity, separating quotes/observations from interpretations.", "Communicates results in a tight readout that leads to concrete next steps."],
    },
    3: {
      title: "Plan, synthesize, and influence decisions",
      description: "Practitioners design studies that answer real product questions and produce evidence leaders can act on. They triangulate sources—sessions, telemetry, support tickets—to avoid single‑data‑point decisions. Example: they pair funnel data with usability testing to explain why checkout drop‑off is happening and what to change first.",
      bullets: ["Writes a solid research plan with risks, biases, and how results will be used in product decisions.", "Combines qual + quant signals and explains confidence levels and limitations.", "Partners with PM/eng/data to instrument metrics and validate impact after changes ship."],
    },
    4: {
      title: "Lead research programs and mentor others",
      description: "Advanced practitioners lead research efforts across multiple initiatives and build repeatable practices. They coach teammates on interview technique, analysis consistency, and avoiding leading questions. Example: they establish a monthly research cadence, standard templates, and a shared repository so insights are reused instead of rediscovered.",
      bullets: ["Leads multi‑study research programs (discovery → evaluation → measurement) tied to roadmap outcomes.", "Mentors designers on moderation, synthesis, and stakeholder readouts; raises the team's research bar.", "Creates lightweight governance (templates, repositories, tagging) so research is findable and reusable."],
    },
    5: {
      title: "Set research strategy and scale impact",
      description: "Experts set the research strategy for a domain and ensure the org makes decisions based on evidence, not anecdote. They influence leadership on what to study, when to stop studying, and how to invest in research ops. Example: they define north‑star experience metrics, establish standards, and hold teams accountable for using research in major bets.",
      bullets: ["Defines research strategy and measurement approach for a product area, including key metrics and decision thresholds.", "Leads cross‑functional alignment on insights and trade‑offs; resolves conflicts with evidence and narrative.", "Builds scalable systems (ops, tooling, training) so research capacity grows beyond a single person."],
    },
  }),

  createSkill("design-thinking", "Design thinking", {
    1: {
      title: "Foundations",
      description: "Learners understand the basic loop: frame, explore, test, refine. They can participate in exercises but need facilitation. Example: they contribute to a HMW prompt set and add ideas during ideation.",
      bullets: ["Uses basic framing tools (HMW, assumptions) with guidance.", "Participates in ideation and can explain why multiple options matter.", "Understands divergence vs convergence at a high level."],
    },
    2: {
      title: "Apply to scoped problems",
      description: "Juniors apply lightweight design thinking to clarify problems and generate options. They avoid jumping to a single solution too early. Example: they reframe a stakeholder request into a problem statement and propose 2–3 solution paths.",
      bullets: ["Writes clear problem statements and success criteria for a feature.", "Generates multiple solution approaches before selecting one.", "Uses quick validation (5-second tests, peer reviews) to converge."],
    },
    3: {
      title: "Drive decisions",
      description: "Practitioners use methods pragmatically to move teams to decisions. They choose the right tool for the context and timebox effectively. Example: they run a short workshop to align on a workflow redesign and exit with prioritized concepts.",
      bullets: ["Selects methods based on risk and uncertainty (not habit).", "Facilitates diverge/converge to produce a decision artifact.", "Connects concepts to user outcomes and delivery constraints."],
    },
    4: {
      title: "Mentor and adapt methods",
      description: "Advanced designers adapt methods for real constraints and mentor others to avoid design theater. They help teams think clearly in ambiguity and land on actionable next steps. Example: they coach a squad through a messy problem and produce a testable plan.",
      bullets: ["Coaches teams on framing, assumptions, and evidence standards.", "Adapts workshops to constraints while preserving decision quality.", "Ensures outputs convert into experiments, backlog, or scope."],
    },
    5: {
      title: "Shape practice",
      description: "Experts shape how the org solves problems: standards, training, and leadership coaching. They influence product direction through better problem framing. Example: they establish principles for discovery and teach leaders how to evaluate problem statements.",
      bullets: ["Establishes standards for discovery and decision-making artifacts.", "Coaches leaders on human-centered framing and trade-offs.", "Builds mentorship and rituals that improve team problem solving."],
    },
  }),
  createSkill("facilitation", "Facilitation", {
    1: {
      title: "Support sessions",
      description: "Learners support workshops and meetings: agenda prep, notes, and timekeeping. They observe how good facilitators manage dynamics. Example: they capture decisions and action items during a critique.",
      bullets: ["Supports agendas, notes, and follow-ups.", "Understands basic facilitation etiquette (timeboxes, turn-taking).", "Captures decisions and next steps accurately."],
    },
    2: {
      title: "Lead small meetings",
      description: "Juniors can facilitate small sessions with clear goals, like critique or alignment meetings. They keep time, encourage participation, and document outputs. Example: they run a 30‑minute critique that results in concrete changes.",
      bullets: ["Runs small sessions with an agenda and clear outcomes.", "Manages participation and keeps discussion on track.", "Produces a summary with decisions, owners, and deadlines."],
    },
    3: {
      title: "Facilitate decision workshops",
      description: "Practitioners design and run workshops that drive decisions and unblock teams. They handle disagreement and keep groups moving. Example: they facilitate a requirements alignment workshop that ends with a signed-off flow and edge cases.",
      bullets: ["Designs workshop structure, activities, and prework for outcomes.", "Handles conflict and keeps the group in problem space.", "Converts outputs into backlog, artifacts, or a plan."],
    },
    4: {
      title: "Lead complex groups",
      description: "Advanced facilitators lead cross-functional groups with competing priorities and mentor others on running effective sessions. Example: they facilitate a roadmap alignment session between design, engineering, and compliance and land clear trade-offs.",
      bullets: ["Facilitates high-stakes sessions with many stakeholders.", "Mentors others on facilitation techniques and de-risking sessions.", "Drives alignment by making trade-offs explicit and documented."],
    },
    5: {
      title: "Set facilitation standards",
      description: "Experts raise facilitation maturity across teams: templates, training, and coaching leaders. They improve how decisions are made at scale. Example: they create a facilitation playbook and coach managers on running decision meetings.",
      bullets: ["Creates playbooks and rituals that improve decision quality.", "Coaches leaders on running effective, inclusive sessions.", "Establishes standards for decision logs and accountability."],
    },
  }),
  createSkill("interface-design", "Interface Design", {
    1: {
      title: "Basic UI literacy",
      description: "Learners can follow a design system and apply basic hierarchy, spacing, and accessibility guidance with review. Example: they build a simple form layout using existing components.",
      bullets: ["Uses the design system components correctly with guidance.", "Understands hierarchy basics (type, spacing, grouping).", "Knows common accessibility requirements (contrast, focus)."],
    },
    2: {
      title: "Consistent screens",
      description: "Juniors design complete screens with common states and fewer defects. They apply patterns consistently and anticipate reviewer feedback. Example: they design empty/error/loading states for a dashboard view.",
      bullets: ["Designs complete screens including key states.", "Applies accessibility checks (labels, focus order) routinely.", "Uses consistent spacing and hierarchy across views."],
    },
    3: {
      title: "Polished interaction design",
      description: "Practitioners design cohesive interfaces across flows, handling edge cases and responsive behavior. They collaborate with engineering to ensure fidelity. Example: they spec interactions for a complex table with filters and inline edits.",
      bullets: ["Designs interactions and states across a flow (not just screens).", "Creates clear specs for behavior, states, and responsiveness.", "Partners with eng to ensure build matches intent."],
    },
    4: {
      title: "Lead UI quality",
      description: "Advanced designers raise UI quality and mentor others on craft and accessibility. They set patterns and guardrails and conduct effective critiques. Example: they establish a pattern for form validation and teach teams to apply it.",
      bullets: ["Leads critiques and mentors others on UI craft.", "Defines/extends patterns and guardrails for consistency.", "Catches accessibility and usability issues early."],
    },
    5: {
      title: "Drive system-level craft",
      description: "Experts influence design system direction and UI strategy across teams. They set quality bars and champion accessibility at scale. Example: they guide a design system update that improves consistency and reduces engineering rework.",
      bullets: ["Shapes design system evolution and governance.", "Sets org-wide quality and accessibility standards.", "Mentors across teams; scales craft through training and reviews."],
    },
  }),
  createSkill("wireframing", "Wireframing", {
    1: {
      title: "Basic structure",
      description: "Learners produce simple wireframes that communicate layout and intent with guidance. Example: they sketch a page structure and annotate key elements.",
      bullets: ["Creates basic page layouts and annotations.", "Uses wireframes to ask the right questions.", "Understands when low fidelity is appropriate."],
    },
    2: {
      title: "Wireflows",
      description: "Juniors create wireflows that show a multi-step process and common states. Example: they map an onboarding flow and include confirmation and error screens.",
      bullets: ["Produces multi-step wireflows with annotations.", "Includes primary states and obvious edge cases.", "Uses fidelity appropriate to decision risk."],
    },
    3: {
      title: "Decision-ready wireframes",
      description: "Practitioners use wireframes to drive alignment and surface constraints early. They include behaviors, rules, and edge cases. Example: they wireframe a permissions-driven flow and specify what changes by role.",
      bullets: ["Creates wireframes that resolve ambiguity and drive decisions.", "Specifies rules, behaviors, and edge cases clearly.", "Collaborates cross-functionally to confirm feasibility."],
    },
    4: {
      title: "Mentor and standardize",
      description: "Advanced designers mentor others on effective wireframing and set standards for clarity. Example: they introduce a wireframing template that reduces review cycles.",
      bullets: ["Mentors teammates on clarity, annotation, and scope.", "Sets standards/templates for consistent wire deliverables.", "Uses wireframes strategically to de-risk complex work."],
    },
    5: {
      title: "Scale alignment artifacts",
      description: "Experts establish org-level practices for early design artifacts and coach leaders on using them. Example: they create a lightweight spec approach that aligns teams while maintaining speed.",
      bullets: ["Defines how wire artifacts fit into delivery workflows.", "Coaches stakeholders on interpreting and using wireframes.", "Scales practices that reduce rework and improve alignment."],
    },
  }),
  createSkill("user-flows", "User Flows", {
    1: {
      title: "Happy path mapping",
      description: "Learners can map a simple happy path and explain user intent at each step. Example: they diagram a sign-up flow and annotate key decisions.",
      bullets: ["Maps a basic flow from start to finish.", "Labels user intent and key decision points.", "Identifies obvious missing steps or screens."],
    },
    2: {
      title: "Include common exceptions",
      description: "Juniors document common alternate paths and basic error handling. Example: they add password reset, validation errors, and back navigation to a flow.",
      bullets: ["Documents alternate paths and basic error states.", "Aligns flows with requirements and constraints.", "Clarifies handoffs between steps and systems."],
    },
    3: {
      title: "End-to-end journeys",
      description: "Practitioners map end-to-end journeys across roles, channels, and states. They use flows to reduce friction and inform prioritization. Example: they redesign a multi-role approval flow and cut steps.",
      bullets: ["Maps complete journeys including edge cases and role differences.", "Uses flows to identify friction and simplify steps.", "Creates decision-ready artifacts for PM/eng alignment."],
    },
    4: {
      title: "Lead cross-system flows",
      description: "Advanced designers lead complex, cross-system flow design and mentor others on reasoning and trade-offs. Example: they map a service spanning web + support + backend rules and prevent failure modes.",
      bullets: ["Leads cross-system flow design and risk reviews.", "Mentors others on edge cases and failure modes.", "Aligns stakeholders by making trade-offs explicit in the flow."],
    },
    5: {
      title: "Set flow standards",
      description: "Experts set standards for journey mapping and flow documentation across teams. They coach leaders on using flows to drive strategy. Example: they define common patterns for approvals and permissions across products.",
      bullets: ["Defines org-wide standards for flow artifacts and reviews.", "Coaches teams on using flows for strategy and planning.", "Establishes patterns that scale across products and roles."],
    },
  }),
  createSkill("service-design", "Service Design", {
    1: {
      title: "Awareness of touchpoints",
      description: "Learners recognize that experiences span people, processes, and tools. They can list touchpoints and handoffs with guidance. Example: they map what happens before and after a user submits a request.",
      bullets: ["Identifies key touchpoints and actors.", "Documents simple handoffs between steps.", "Understands that non-UI steps affect outcomes."],
    },
    2: {
      title: "Map a simple service",
      description: "Juniors map a service with frontstage/backstage steps and highlight pain points. Example: they create a basic blueprint for onboarding that includes support interactions.",
      bullets: ["Creates basic service maps/blueprints.", "Identifies pain points and handoff risks.", "Captures opportunities for improvement."],
    },
    3: {
      title: "Design improvements end-to-end",
      description: "Practitioners design service improvements that involve multiple teams. They coordinate changes across workflows and policy constraints. Example: they redesign an intake process to reduce rework and waiting time.",
      bullets: ["Builds service blueprints tied to measurable outcomes.", "Coordinates improvements across teams and systems.", "Designs for operational realities (policy, staffing, tooling)."],
    },
    4: {
      title: "Lead service initiatives",
      description: "Advanced designers lead service redesign initiatives and mentor others on systems thinking. Example: they reduce cycle time by redesigning approvals, notifications, and ownership models.",
      bullets: ["Leads cross-team service redesign and governance.", "Mentors on systems thinking and operational design.", "Defines metrics to track service outcomes over time."],
    },
    5: {
      title: "Scale service maturity",
      description: "Experts establish service design practices across the org and influence leaders on end-to-end accountability. Example: they define an operating model for a service and standardize ownership, SLAs, and measurement.",
      bullets: ["Sets org-wide service design standards and playbooks.", "Coaches leaders on end-to-end accountability and ownership.", "Institutionalizes measurement and continuous improvement."],
    },
  }),
  createSkill("information-architecture", "Info Architecture", {
    1: {
      title: "Labeling basics",
      description: "Learners understand navigation, labels, and grouping at a basic level. They can follow existing structures and spot confusing labels. Example: they suggest clearer wording for a menu item.",
      bullets: ["Understands basic navigation and labeling concepts.", "Applies existing taxonomy with guidance.", "Identifies confusing labels or groupings."],
    },
    2: {
      title: "Improve structure",
      description: "Juniors propose IA changes with rationale and small validation. Example: they regroup settings screens and test labels with a quick tree test or stakeholder review.",
      bullets: ["Proposes improved grouping and labels with rationale.", "Runs lightweight validation (card sort, quick test).", "Documents IA decisions and assumptions."],
    },
    3: {
      title: "Design scalable IA",
      description: "Practitioners design navigation and taxonomy that scales with future growth. They consider findability, search, and governance. Example: they redesign an admin navigation to reduce duplication and improve discoverability.",
      bullets: ["Designs scalable taxonomy and navigation structures.", "Improves findability using IA + search considerations.", "Coordinates governance and naming conventions."],
    },
    4: {
      title: "Lead IA across systems",
      description: "Advanced designers lead IA efforts across products/systems and mentor others on structure and language. Example: they unify terminology across tools and define rules for adding new categories.",
      bullets: ["Leads IA audits and redesigns across surfaces.", "Mentors others on taxonomy, labeling, and governance.", "Defines rules for growth and prevents taxonomy drift."],
    },
    5: {
      title: "Set IA standards",
      description: "Experts set IA standards and governance across the org and influence product strategy through improved information models. Example: they establish a shared taxonomy and ownership process used by multiple teams.",
      bullets: ["Defines org-wide IA standards, governance, and ownership.", "Coaches teams on language systems and taxonomy health.", "Aligns IA decisions to long-term product strategy."],
    },
  }),
  createSkill("ux-strategy", "UX Strategy", {
    1: {
      title: "Understand goals",
      description: "Learners understand that design work supports outcomes and can explain the 'why' behind a feature at a basic level. Example: they can restate a goal like reducing support calls for a workflow.",
      bullets: ["Understands how design ties to product goals.", "Can restate objectives and constraints clearly.", "Identifies stakeholders and success measures with help."],
    },
    2: {
      title: "Contribute to planning",
      description: "Juniors contribute to planning by connecting user needs to proposed work. Example: they propose scope adjustments after identifying the highest-friction step in a journey.",
      bullets: ["Connects user needs to planned work and priorities.", "Suggests scope cuts or sequencing to improve outcomes.", "Communicates rationale to stakeholders clearly."],
    },
    3: {
      title: "Own experience direction",
      description: "Practitioners own experience direction within a scope and help define success measures. Example: they create an experience brief that guides design/eng decisions across a feature set.",
      bullets: ["Defines experience goals and success measures for an initiative.", "Creates artifacts (briefs, principles) that guide delivery.", "Aligns stakeholders through trade-offs and evidence."],
    },
    4: {
      title: "Lead strategic decisions",
      description: "Advanced designers influence roadmaps and mentor others on strategic framing. Example: they push for foundational usability work over feature expansion based on user impact and cost of delay.",
      bullets: ["Influences roadmap priorities using user + business evidence.", "Mentors others on strategic framing and trade-offs.", "Leads alignment with clear narratives and decision points."],
    },
    5: {
      title: "Set experience strategy",
      description: "Experts set experience strategy across products and coach leaders on making user-centered decisions. Example: they define an experience north star and governance model used across teams.",
      bullets: ["Defines org-wide experience principles and strategy.", "Coaches leaders on decision-making through an experience lens.", "Establishes governance and standards for sustained impact."],
    },
  }),
  createSkill("agile-methods", "Agile Methods", {
    1: {
      title: "Agile basics",
      description: "Learners understand agile concepts and how design fits into iterative delivery. Example: they participate in ceremonies and deliver small, scoped design tasks.",
      bullets: ["Understands ceremonies and roles (standup, planning, review).", "Delivers small design work in a sprint cadence.", "Communicates blockers and dependencies with help."],
    },
    2: {
      title: "Operate in sprints",
      description: "Juniors manage design tasks within sprints and coordinate handoffs with PM/eng. Example: they keep a backlog of design tasks and deliver just-in-time assets for a story.",
      bullets: ["Plans and delivers design work within sprint constraints.", "Coordinates handoffs and clarifies acceptance criteria.", "Adapts to changes while protecting design intent."],
    },
    3: {
      title: "Partner for delivery",
      description: "Practitioners partner with PM/eng to sequence discovery and delivery, reducing rework. Example: they run ahead-of-sprint design where needed and keep scope realistic.",
      bullets: ["Shapes sequencing of discovery vs delivery with PM/eng.", "Right-sizes scope and makes trade-offs explicit.", "Maintains design quality through build, QA, and iteration."],
    },
    4: {
      title: "Lead process improvements",
      description: "Advanced designers improve team delivery processes and mentor others on effective collaboration. Example: they introduce better refinement rituals, critique cadence, or definition of ready for design.",
      bullets: ["Leads improvements to team rituals and workflows.", "Mentors others on working effectively in agile.", "Protects quality while meeting delivery timelines."],
    },
    5: {
      title: "Scale agile design practice",
      description: "Experts scale effective product delivery practices across teams. They coach leaders on integrating design into planning and measurement. Example: they standardize discovery practices and quality bars across a portfolio.",
      bullets: ["Sets standards for integrating design into agile at scale.", "Coaches leaders on healthy delivery and measurement.", "Builds mentorship and systems that sustain quality."],
    },
  }),
];
