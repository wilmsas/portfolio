"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * DesignSkillsMatrix.tsx (clean rebuild)
 * - Lane-based proficiency matrix (5-level scale)
 * - Baseline (Design) + Strategist specialty (requested subsets)
 * - Edit mode: lanes + two half-width cards (Selected Competency + Proficiency Visualized)
 * - Visualize mode: large charts that fill the card (manager view)
 * - LocalStorage persistence with normalization (clamps legacy 1–8 -> 1–5)
 *
 * NOTE: This file is self-contained. No external chart libs needed.
 */

/** ---------- Levels (5-point scale) ---------- */

const LEVELS = [1, 2, 3, 4, 5] as const;
type Level = (typeof LEVELS)[number];

const LEVEL_LABELS: Record<Level, string> = {
  1: "Learner",
  2: "Junior",
  3: "Practitioner",
  4: "Advanced",
  5: "Expert",
};

type SkillLevel = { title: string; description: string; bullets: string[] };

type Skill = {
  id: string;
  label: string;
  category?: string;
  levels: Record<Level, SkillLevel>;
};

type Selections = Record<string, Level | undefined>;

const STORAGE_KEY_BASE = "design-skills-matrix:lanes:baseline:v6";
const STORAGE_KEY_SPEC_STRATEGIST = "design-skills-matrix:lanes:strategist:v6";
const STORAGE_KEY_SPEC_UI_DESIGNER = "design-skills-matrix:lanes:ui-designer:v1";
const STORAGE_KEY_SPEC_UX_ARCHITECT = "design-skills-matrix:lanes:ux-architect:v1";
const STORAGE_KEY_SPEC_VISUAL_DESIGNER = "design-skills-matrix:lanes:visual-designer:v1";

/** ---------- Helpers ---------- */

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function normalizeSelections(raw: any, skills: Skill[]): Selections {
  const out: Selections = {};
  if (!raw || typeof raw !== "object") return out;

  const validIds = new Set(skills.map((s) => s.id));

  for (const [k, v] of Object.entries(raw)) {
    if (!validIds.has(k)) continue;
    if (typeof v !== "number" || !Number.isFinite(v)) continue;

    const n = Math.round(v);
    if (n < 1) continue;
    out[k] = clamp(n, 1, 5) as Level;
  }

  return out;
}


function mkSkillRich(
  id: string,
  label: string,
  levels: Record<Level, SkillLevel>,
  category?: string
): Skill {
  return { id, label, category, levels };
}

function wrapSvgLabel(label: string): string[] {
  const s = String(label || "").trim();
  // Only wrap very long labels (target: "Information Architecture")
  if (s.length <= 18) return [s];
  const words = s.split(/\s+/).filter(Boolean);
  if (words.length <= 1) return [s];
  // Split roughly in half
  const mid = Math.ceil(words.length / 2);
  const line1 = words.slice(0, mid).join(" ");
  const line2 = words.slice(mid).join(" ");
  return [line1, line2].filter(Boolean);
}

/** ---------- Data (requested subsets) ---------- */

// Baseline (Design) — requested subset list
const BASELINE_SKILLS: Skill[] = [
    mkSkillRich("research", "Research", {
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
      bullets: ["Leads multi‑study research programs (discovery → evaluation → measurement) tied to roadmap outcomes.", "Mentors designers on moderation, synthesis, and stakeholder readouts; raises the team’s research bar.", "Creates lightweight governance (templates, repositories, tagging) so research is findable and reusable."],
    },
    5: {
      title: "Set research strategy and scale impact",
      description: "Experts set the research strategy for a domain and ensure the org makes decisions based on evidence, not anecdote. They influence leadership on what to study, when to stop studying, and how to invest in research ops. Example: they define north‑star experience metrics, establish standards, and hold teams accountable for using research in major bets.",
      bullets: ["Defines research strategy and measurement approach for a product area, including key metrics and decision thresholds.", "Leads cross‑functional alignment on insights and trade‑offs; resolves conflicts with evidence and narrative.", "Builds scalable systems (ops, tooling, training) so research capacity grows beyond a single person."],
    },
  }),

  mkSkillRich("design-thinking", "Design thinking", {
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
  mkSkillRich("facilitation", "Facilitation", {
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
  mkSkillRich("interface-design", "Interface Design", {
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
  mkSkillRich("wireframing", "Wireframing", {
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
  mkSkillRich("user-flows", "User Flows", {
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
  mkSkillRich("service-design", "Service Design", {
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
  mkSkillRich("information-architecture", "Info Architecture", {
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
  mkSkillRich("ux-strategy", "UX Strategy", {
    1: {
      title: "Understand goals",
      description: "Learners understand that design work supports outcomes and can explain the ‘why’ behind a feature at a basic level. Example: they can restate a goal like reducing support calls for a workflow.",
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
  mkSkillRich("agile-methods", "Agile Methods", {
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

// Strategist specialty — requested subset list
const STRATEGIST_SKILLS: Skill[] = [
  mkSkillRich("frontend-dev", "Frontend dev", {
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
  mkSkillRich("vision-setting", "Vision setting", {
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
  mkSkillRich("roadmapping", "Roadmapping", {
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
  mkSkillRich("data-analysis", "Data analysis", {
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
  mkSkillRich("artifact-creation", "Artifact creation", {
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
  mkSkillRich("business-alignment", "Business alignment", {
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
  mkSkillRich("stakeholder-mgmt", "Stakeholder management", {
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

// --- Additional specialties (expanded) ---

const UI_DESIGNER_SKILLS: Skill[] = [
  mkSkillRich("ui-craft", "UI Foundations", {
    1: {
      title: "Use patterns correctly",
      description: "Learners can assemble screens using the design system without inventing new patterns. They focus on clear hierarchy—what’s primary vs secondary—and avoid cramming. Example: they build a settings page using existing components and ask for feedback on spacing and emphasis.",
      bullets: ["Applies standard components and spacing tokens consistently.", "Uses headings, grouping, and progressive disclosure to reduce cognitive load.", "Flags unclear requirements and asks for review early."],
    },
    2: {
      title: "Refine clarity with feedback",
      description: "Juniors improve layouts by adjusting density, grouping, and emphasis based on critique. They can explain why a layout choice supports a user task, not just that it “looks better.” Example: they rework an empty state so the next action is obvious and the screen reads in a clean scan path.",
      bullets: ["Improves hierarchy using typography and spacing with review.", "Keeps UI consistent with system patterns; avoids one-off styling.", "Explains layout choices in terms of user intent and task flow."],
    },
    3: {
      title: "Own UI decisions for a feature",
      description: "Practitioners own the UI for a scoped feature end‑to‑end and can defend trade‑offs. They anticipate responsive behavior and edge states. Example: they design a data table experience with sorting, empty/loading/error states, and handoff specs engineers can build.",
      bullets: ["Designs complete state coverage (empty/loading/error/permissions).", "Balances polish with delivery constraints and communicates trade‑offs.", "Produces handoff-ready specs (tokens, spacing, behaviors)."],
    },
    4: {
      title: "Lead patterns and raise the bar",
      description: "Advanced designers lead UI patterns across multiple screens or products and mentor others through critique. They keep consistency while adapting patterns to new needs. Example: they define a reusable filter panel pattern and roll it out across a suite, guiding implementation and adoption.",
      bullets: ["Leads UI pattern work across teams; prevents visual drift.", "Mentors peers through critique with specific, teachable feedback.", "Partners with engineering to validate feasibility and quality."],
    },
    5: {
      title: "Set standards and coach at scale",
      description: "Experts set the craft bar for a product area and make quality repeatable. They create governance so teams ship consistent UI even as people rotate. Example: they establish UI review standards, update system guidance, and coach leads on maintaining quality under deadline.",
      bullets: ["Defines UI quality standards and review practices for a product area.", "Drives design system contributions and adoption plans.", "Coaches senior designers/leads on craft strategy and decision-making."],
    },
  }),
  mkSkillRich("interaction-states", "IxD and States", {
    1: {
      title: "Understand basic interactions",
      description: "Learners can describe common interaction patterns (forms, menus, modals) and implement them using existing components. They focus on not breaking expected behavior. Example: they wire up a simple form with validation messages and confirm/cancel patterns in the right places.",
      bullets: ["Uses established interaction patterns without inventing novel behavior.", "Understands basic validation and error messaging expectations.", "Documents simple interaction notes for review."],
    },
    2: {
      title: "Design flows and micro-decisions",
      description: "Juniors start designing interaction details that reduce user mistakes: defaults, guardrails, and clear feedback. Example: they improve a multi-step wizard so users can recover from errors and understand progress without confusion.",
      bullets: ["Designs clear feedback and recovery for common errors.", "Chooses sensible defaults and reduces unnecessary choices.", "Communicates interaction rationale and edge cases to reviewers."],
    },
    3: {
      title: "Own complex behaviors",
      description: "Practitioners design complex behaviors like bulk actions, permissions-based UI, or asynchronous processes. They account for latency and partial failure. Example: they design an import flow with progress, retries, and a results summary that supports next actions.",
      bullets: ["Designs for async states (progress, partial success, retries).", "Handles edge cases and permissions without confusing the user.", "Creates interaction specs engineers can implement confidently."],
    },
    4: {
      title: "Mentor and systematize behavior",
      description: "Advanced designers lead interaction models that multiple features reuse and coach others on behavioral consistency. Example: they standardize notification and toast behavior across the app so users aren’t surprised by inconsistent feedback.",
      bullets: ["Leads interaction models across features; prevents inconsistent behavior.", "Mentors peers on behavior-first thinking and edge-case coverage.", "Partners with PM/eng on sequencing and risk management."],
    },
    5: {
      title: "Define interaction strategy",
      description: "Experts set interaction principles and governance for a product suite. They push for coherent behavior across platforms and ensure the org doesn’t ship confusing inconsistencies. Example: they define platform interaction guidelines and enforce them through reviews and system updates.",
      bullets: ["Defines interaction principles and platform guidance for a domain.", "Drives cross-team alignment on behavioral standards and exceptions.", "Coaches leaders on interaction trade-offs under constraints."],
    },
  }),
  mkSkillRich("componentization", "Design Systems", {
    1: {
      title: "Use the system",
      description: "Learners can use system components and tokens accurately and know when to ask before creating a new variant. Example: they build a page using existing card, button, and form components without custom CSS hacks.",
      bullets: ["Uses tokens for spacing, color, typography instead of ad-hoc values.", "Follows component guidelines and variants.", "Raises system gaps with examples."],
    },
    2: {
      title: "Contribute small improvements",
      description: "Juniors can propose a small component extension with clear rationale and examples. Example: they request a new input helper pattern after seeing repeated one-off solutions across screens.",
      bullets: ["Documents a component request with use cases and states.", "Understands review/acceptance process for system changes.", "Avoids system proliferation by reusing existing patterns first."],
    },
    3: {
      title: "Design reusable patterns",
      description: "Practitioners design reusable patterns and coordinate with engineering for implementation and adoption. Example: they define a new “empty state” pattern with guidelines and ship it across multiple teams.",
      bullets: ["Defines component/pattern specs including accessibility and states.", "Partners with engineers on API shape, constraints, and rollout.", "Helps teams migrate from one-offs to system patterns."],
    },
    4: {
      title: "Lead system governance",
      description: "Advanced designers mentor others on system thinking and keep the system healthy: versioning, deprecation, and consistency. Example: they run a monthly system review and prevent design drift across a growing product suite.",
      bullets: ["Leads design system roadmap and contribution intake for a domain.", "Mentors designers on system usage and when to extend.", "Establishes governance to prevent drift and duplication."],
    },
    5: {
      title: "Set system strategy",
      description: "Experts set the design system strategy aligned to product goals and platform constraints. They ensure the system scales org-wide and supports velocity. Example: they define principles, ownership, and success metrics for system adoption and quality.",
      bullets: ["Defines design system strategy, ownership, and success metrics.", "Aligns leaders on investment and trade-offs (speed vs customization).", "Coaches leads on using the system to deliver consistently at scale."],
    },
  }),
  mkSkillRich("accessible-ui", "Accessibility", {
    1: {
      title: "Learn and apply basics",
      description: "Learners apply basic accessibility practices and check obvious issues. Example: they ensure buttons have clear labels, focus states exist, and color contrast is acceptable before asking for review.",
      bullets: ["Knows core principles: contrast, keyboard navigation, labels.", "Uses accessible components and avoids color-only meaning.", "Flags potential issues for help."],
    },
    2: {
      title: "Build with accessibility in mind",
      description: "Juniors design accessibility into flows, not as a later fix. Example: they design a form with proper error summaries and ensure screen readers can understand what went wrong.",
      bullets: ["Designs clear labeling, helper text, and error patterns.", "Checks keyboard/focus order and interaction traps.", "Documents accessibility notes in handoff."],
    },
    3: {
      title: "Own accessibility quality",
      description: "Practitioners lead accessibility for a feature and partner with engineers to test and remediate issues. Example: they run through key flows with keyboard-only and screen reader testing and file actionable fixes.",
      bullets: ["Creates accessibility acceptance criteria and test checklists.", "Partners with eng/QA to verify fixes and regressions.", "Balances inclusive design with constraints and documents trade-offs."],
    },
    4: {
      title: "Mentor and scale practices",
      description: "Advanced designers mentor others and help standardize accessible patterns across the product. Example: they define accessible data visualization guidance and run training for the team.",
      bullets: ["Mentors designers on inclusive patterns and review habits.", "Standardizes accessible components/patterns across teams.", "Coordinates accessibility improvements with product and engineering."],
    },
    5: {
      title: "Set inclusive design strategy",
      description: "Experts set accessibility strategy and governance for the org, tying it to risk management and quality. Example: they define compliance targets, establish audits, and ensure accessibility is part of the release process.",
      bullets: ["Defines accessibility strategy, governance, and release gates.", "Drives leadership alignment on risk, compliance, and investment.", "Coaches leads on inclusive design trade-offs and accountability."],
    },
  }),
  mkSkillRich("visual-qa", "Visual QA", {
    1: {
      title: "Hand off clearly",
      description: "Learners provide clean handoff specs and can spot obvious visual bugs. Example: they compare staging vs Figma and file a short list of spacing and typography mismatches.",
      bullets: ["Provides specs using tokens, redlines, and state notes.", "Reviews implementation for obvious inconsistencies.", "Communicates issues respectfully and clearly."],
    },
    2: {
      title: "Triage and clarify issues",
      description: "Juniors can triage UI issues by impact and work with engineers to clarify intent. Example: they identify which defects block release vs which can ship with a ticket.",
      bullets: ["Prioritizes UI issues by user impact and scope.", "Clarifies intent with engineers and updates specs when needed.", "Learns component constraints and avoids impossible asks."],
    },
    3: {
      title: "Drive quality to done",
      description: "Practitioners drive UI quality through implementation, including responsive and cross-browser concerns. Example: they partner with engineering to resolve layout issues on smaller breakpoints and verify fixes before sign-off.",
      bullets: ["Owns visual QA across breakpoints and key browsers.", "Negotiates trade-offs while protecting core usability and clarity.", "Establishes a repeatable QA checklist for the feature."],
    },
    4: {
      title: "Lead delivery standards",
      description: "Advanced designers create repeatable collaboration patterns with engineering to keep quality high as throughput increases. Example: they set a UI review cadence and build a shared defect taxonomy that speeds up fixes.",
      bullets: ["Leads cross-team UI review processes and quality standards.", "Mentors designers on pragmatic implementation collaboration.", "Improves workflows so quality is maintained under time pressure."],
    },
    5: {
      title: "Set org-wide quality bar",
      description: "Experts define the quality bar and governance for UI implementation across the product suite. Example: they establish acceptance criteria, escalation paths, and shared tooling so quality doesn’t depend on heroic effort.",
      bullets: ["Defines org-wide UI quality standards and acceptance criteria.", "Aligns leadership on quality investment and enforcement.", "Coaches leads on scaling quality without slowing delivery."],
    },
  }),
  mkSkillRich("motion-micro", "Microinteractions", {
    1: {
      title: "Use motion sparingly",
      description: "Learners understand motion should clarify, not distract. Example: they use a subtle loading skeleton and a simple transition that helps users understand state change.",
      bullets: ["Uses motion patterns from the system when available.", "Avoids excessive animation that harms clarity or performance.", "Explains the purpose of motion in simple terms."],
    },
    2: {
      title: "Design helpful feedback",
      description: "Juniors use microinteractions to improve comprehension and reduce errors. Example: they add inline validation feedback that appears at the right moment and helps users recover.",
      bullets: ["Designs feedback timing (when to show errors, confirmations, progress).", "Keeps motion consistent with brand and accessibility preferences.", "Documents motion intent for engineering."],
    },
    3: {
      title: "Own motion patterns",
      description: "Practitioners define motion behavior for key flows and ensure it works with performance and accessibility settings. Example: they define motion for expanding panels, progress states, and confirmations without causing jank.",
      bullets: ["Defines motion specs (duration, easing intent, triggers) for key patterns.", "Partners with engineers on performance and reduced-motion behavior.", "Uses motion to reinforce hierarchy and state change."],
    },
    4: {
      title: "Mentor and standardize",
      description: "Advanced designers mentor teams on motion and create reusable motion guidance. Example: they build a motion library for common patterns so teams don’t invent inconsistent transitions.",
      bullets: ["Leads creation of reusable motion patterns and guidelines.", "Mentors designers on when motion adds value vs noise.", "Ensures motion choices remain consistent across a product suite."],
    },
    5: {
      title: "Set motion strategy",
      description: "Experts set a motion strategy that supports brand, usability, and accessibility across products. Example: they define motion principles and governance so motion is coherent and defensible in reviews.",
      bullets: ["Defines motion principles, governance, and quality bar for a domain.", "Aligns stakeholders on trade-offs (delight vs clarity vs performance).", "Coaches senior designers/leads on motion strategy and critique."],
    },
  }),
  mkSkillRich("ui-content", "Content Strategy", {
    1: {
      title: "Write clear basics",
      description: "Learners can write straightforward labels, helper text, and empty states using existing tone guidance. Example: they rewrite a button label from “Submit” to “Save changes” so intent is obvious.",
      bullets: ["Uses clear, specific labels and avoids jargon where possible.", "Writes basic helper text and error messages with guidance.", "Flags copy ambiguities that may confuse users."],
    },
    2: {
      title: "Improve comprehension",
      description: "Juniors shape microcopy to reduce confusion and guide next actions. Example: they redesign an error message so it explains the problem and the fix, not just that something failed.",
      bullets: ["Writes actionable error messages and success confirmations.", "Ensures consistency in terminology across screens.", "Tests copy choices informally with teammates or users."],
    },
    3: {
      title: "Own content patterns",
      description: "Practitioners define content patterns and maintain consistency across a feature set. Example: they standardize language for permissions, warnings, and irreversible actions so users understand risk.",
      bullets: ["Defines copy patterns for key moments (warnings, confirmations, permissions).", "Partners with legal/compliance when language has risk implications.", "Uses research/telemetry feedback to refine wording over time."],
    },
    4: {
      title: "Mentor and govern terminology",
      description: "Advanced designers mentor teams on writing and establish terminology governance. Example: they create a glossary and enforce it through reviews so the product doesn’t drift into inconsistent naming.",
      bullets: ["Leads terminology governance and glossary updates across teams.", "Mentors designers on concise, user-centered writing.", "Ensures content decisions align with brand and accessibility needs."],
    },
    5: {
      title: "Set content strategy",
      description: "Experts set a content strategy for a domain and ensure language supports product strategy and trust. Example: they align leadership on tone, risk language, and consistency standards, then bake it into review and system guidance.",
      bullets: ["Defines content strategy and quality bar for a product area.", "Aligns leaders on tone, trust, and risk language decisions.", "Coaches leads on content trade-offs and scaling governance."],
    },
  }),
];

const UX_ARCHITECT_SKILLS: Skill[] = [
  mkSkillRich("ia-taxonomy", "Information Architecture", {
    1: {
      title: "Understand structure",
      description: "Learners can map simple navigation and labeling using existing patterns. They focus on clarity and consistency. Example: they propose a left-nav structure for a small tool and validate labels with a quick card sort or peer review.",
      bullets: ["Creates a basic sitemap and navigation draft using common patterns.", "Writes clear labels and avoids duplicate/ambiguous terms.", "Asks for review when structure impacts multiple teams or systems."],
    },
    2: {
      title: "Improve findability",
      description: "Juniors can reorganize sections to reduce hunting and clicking. Example: they audit a settings area, merge duplicates, and propose a clearer grouping with rationale.",
      bullets: ["Uses simple IA methods (card sort, tree test, content audit) with guidance.", "Explains the rationale for grouping and naming decisions.", "Updates IA documentation so the team can follow it."],
    },
    3: {
      title: "Own IA for a product area",
      description: "Practitioners own IA decisions for a product area and keep them coherent as features grow. Example: they define the taxonomy for a marketplace so filters, categories, and search results stay consistent across releases.",
      bullets: ["Defines taxonomy, navigation rules, and labeling conventions.", "Handles edge cases like permissions-based visibility and deep linking.", "Partners with research/data to validate findability and outcomes."],
    },
    4: {
      title: "Lead IA across systems",
      description: "Advanced architects lead IA across multiple products and mentor others on scalable structure. Example: they align three teams on shared categories and prevent drift through governance and review.",
      bullets: ["Leads cross-team taxonomy alignment and prevents fragmentation.", "Mentors designers on IA methods and decision-making.", "Establishes governance for labeling changes and deprecations."],
    },
    5: {
      title: "Set IA strategy and governance",
      description: "Experts set the IA strategy for a suite and ensure long-term coherence. Example: they define enterprise taxonomy standards, ownership, and change control so teams can move fast without breaking findability.",
      bullets: ["Defines IA strategy, ownership, and review gates for a domain.", "Resolves conflicts between teams using principles and evidence.", "Coaches leaders on structural trade-offs and long-term maintenance."],
    },
  }, "Architecture"),
  mkSkillRich("info-modeling", "Information modeling", {
    1: {
      title: "Understand entities",
      description: "Learners can identify key objects (users, projects, orders) and how they appear in the UI. Example: they document what fields matter for a list vs detail view and ask how data is sourced.",
      bullets: ["Identifies core entities and basic relationships in a feature.", "Maps primary fields to UI surfaces (list, detail, edit).", "Flags unknown data rules and seeks clarification."],
    },
    2: {
      title: "Model with guidance",
      description: "Juniors can draft an information model for a feature and validate it with PM/eng. Example: they define a project entity with statuses, transitions, and required fields, then ensure the UI supports those rules.",
      bullets: ["Drafts entity/relationship diagrams at a feature level.", "Documents key rules (required fields, statuses, permissions).", "Coordinates with engineering to align UI and data behavior."],
    },
    3: {
      title: "Own models and constraints",
      description: "Practitioners own information models for a product area and ensure the UI stays consistent with data rules. Example: they design a permissions model that drives which actions and fields appear across roles.",
      bullets: ["Defines models that support multiple roles and workflows.", "Prevents inconsistency by documenting rules and shared patterns.", "Uses the model to inform navigation, forms, and validation."],
    },
    4: {
      title: "Mentor and standardize modeling",
      description: "Advanced architects mentor teams on modeling and establish reusable schemas/patterns. Example: they standardize status models across products so users experience predictable behavior.",
      bullets: ["Leads standard schemas/patterns and teaches modeling habits.", "Creates governance for model changes and migrations.", "Improves system reliability by reducing contradictory UI/data rules."],
    },
    5: {
      title: "Set modeling strategy",
      description: "Experts set modeling strategy for a platform and align stakeholders on constraints, extensibility, and governance. Example: they define platform conventions that multiple products build on without reinventing fundamentals.",
      bullets: ["Defines platform modeling principles and governance.", "Aligns leaders on extensibility vs simplicity trade-offs.", "Coaches leads on using models to drive coherent UX."],
    },
  }, "Architecture"),
  mkSkillRich("patterns-system", "Pattern Strategy & Systems", {
    1: {
      title: "Use patterns consistently",
      description: "Learners apply existing patterns and document when a need doesn’t fit. Example: they reuse a standard wizard pattern instead of designing a bespoke flow.",
      bullets: ["Reuses approved patterns and follows guidance.", "Documents mismatches and asks before creating new patterns.", "Keeps behavior consistent across screens."],
    },
    2: {
      title: "Propose reusable patterns",
      description: "Juniors propose small pattern improvements backed by examples. Example: they suggest a standard bulk action pattern after seeing repeated one-offs.",
      bullets: ["Collects examples and articulates the shared problem.", "Defines required states and accessibility considerations.", "Works with system owners for review."],
    },
    3: {
      title: "Design patterns for adoption",
      description: "Practitioners design patterns with adoption in mind: API shape, constraints, and rollout. Example: they define a filter pattern and ship it across multiple squads.",
      bullets: ["Defines pattern specs, constraints, and success criteria.", "Partners with engineering on component APIs and implementation.", "Supports rollout and migration from legacy patterns."],
    },
    4: {
      title: "Lead system roadmap",
      description: "Advanced architects lead the pattern/system roadmap and mentor teams on system thinking. Example: they run contribution reviews and prevent duplication and drift.",
      bullets: ["Owns system roadmap and prioritizes contributions by impact.", "Mentors designers on extending vs reusing patterns.", "Establishes governance to prevent drift across products."],
    },
    5: {
      title: "Set system strategy",
      description: "Experts set system strategy across a platform and ensure it enables velocity with quality. Example: they align leadership on investment and define governance so the system scales org-wide.",
      bullets: ["Defines system strategy, ownership, and adoption metrics.", "Aligns leaders on investment and trade-offs.", "Coaches leads on scaling design systems and governance."],
    },
  }, "Architecture"),
  mkSkillRich("cross-system", "Cross-System Journeys", {
    1: {
      title: "Map basic journeys",
      description: "Learners can map a user journey across a couple screens or tools and identify handoffs. Example: they document where a request moves from intake to approval.",
      bullets: ["Creates simple journey maps and identifies handoffs.", "Notes role differences and obvious permission constraints.", "Flags unknown systems/owners early."],
    },
    2: {
      title: "Design handoffs with support",
      description: "Juniors design cross-system handoffs with guidance, making states and ownership clear. Example: they design a workflow that moves between a ticketing tool and an internal app with clear status mapping.",
      bullets: ["Defines handoff states and ownership at each step.", "Documents how permissions affect visibility and actions.", "Coordinates with stakeholders to validate flow."],
    },
    3: {
      title: "Own multi-system workflows",
      description: "Practitioners own multi-system workflows and design for failure modes. Example: they design a procurement flow that includes approvals, notifications, and rollback/retry paths.",
      bullets: ["Designs end-to-end flows including failure and recovery.", "Ensures status mapping and notifications are consistent.", "Partners with eng/ops to validate feasibility and integration points."],
    },
    4: {
      title: "Lead complex programs",
      description: "Advanced architects lead complex programs spanning teams and mentor others on workflow design. Example: they align multiple product owners on a shared status model and integration contract.",
      bullets: ["Leads alignment across teams on workflow and integration contracts.", "Mentors designers on designing for permissions, latency, and errors.", "Creates governance to prevent divergence across systems."],
    },
    5: {
      title: "Set platform workflow strategy",
      description: "Experts set workflow strategy across a platform and ensure the org can evolve without breaking users. Example: they define shared models and governance for cross-system experiences.",
      bullets: ["Defines platform workflow principles, models, and governance.", "Resolves cross-team conflicts with principles and evidence.", "Coaches leadership on long-term maintainability."],
    },
  }, "Architecture"),
  mkSkillRich("complexity-reduction", "Complexity Reduction", {
    1: {
      title: "Spot obvious complexity",
      description: "Learners can identify clutter, redundant steps, and confusing terminology. Example: they suggest combining two screens that repeat the same inputs.",
      bullets: ["Identifies redundancies and unclear labels.", "Suggests simple consolidation opportunities.", "Asks for help validating impact."],
    },
    2: {
      title: "Simplify within a feature",
      description: "Juniors simplify flows by reducing steps and clarifying choices. Example: they reduce a form from 20 fields to 12 by deferring advanced options behind progressive disclosure.",
      bullets: ["Applies progressive disclosure and sensible defaults.", "Clarifies choices with better grouping and labels.", "Uses feedback to validate simplification."],
    },
    3: {
      title: "Reduce complexity systematically",
      description: "Practitioners simplify complex domains without losing capability. Example: they redesign an admin workflow so advanced actions are discoverable but not overwhelming.",
      bullets: ["Uses information models and IA to simplify systematically.", "Balances power-user needs with novice clarity.", "Measures impact using task success/time-to-complete metrics."],
    },
    4: {
      title: "Mentor on simplification",
      description: "Advanced architects mentor teams on complexity reduction and establish patterns that scale. Example: they create standard templates for advanced settings and permissions UI.",
      bullets: ["Mentors teams on simplification techniques and trade-offs.", "Creates reusable patterns/templates that reduce cognitive load.", "Leads critiques focused on clarity and task success."],
    },
    5: {
      title: "Set clarity strategy",
      description: "Experts set a clarity strategy for a domain and hold teams accountable to it. Example: they define principles and governance that prevent incremental complexity creep.",
      bullets: ["Defines clarity principles and governance to prevent creep.", "Aligns leaders on trade-offs and long-term maintenance costs.", "Coaches leads on simplifying complex domains at scale."],
    },
  }, "Architecture"),
  mkSkillRich("documentation-governance", "Documentation & Governance", {
    1: {
      title: "Document decisions",
      description: "Learners can keep basic IA and workflow docs updated and note decisions made in reviews. Example: they update a sitemap and add a short decision log entry after critique.",
      bullets: ["Updates simple docs (sitemaps, flow diagrams) when changes happen.", "Captures decisions and open questions.", "Uses shared templates and conventions."],
    },
    2: {
      title: "Maintain usable docs",
      description: "Juniors maintain docs that teams actually use and keep them current. Example: they keep a glossary and navigation rules up to date during a release cycle.",
      bullets: ["Maintains a glossary and labeling rules with review.", "Keeps docs discoverable and aligned to the system of record.", "Communicates doc updates to stakeholders."],
    },
    3: {
      title: "Own governance in a scope",
      description: "Practitioners own governance for a product area—decision logs, reviews, and change control. Example: they run a monthly IA review and manage labeling changes safely.",
      bullets: ["Defines review cadence and decision logs for a product area.", "Manages changes (deprecations, renames) with minimal user disruption.", "Partners with PM/eng/support to align on impacts."],
    },
    4: {
      title: "Lead governance across teams",
      description: "Advanced architects lead governance across teams and mentor others to keep structure consistent. Example: they establish change-control rules so teams can evolve without breaking the ecosystem.",
      bullets: ["Leads cross-team governance and change control practices.", "Mentors designers/PMs on decision hygiene and documentation.", "Creates escalation paths for conflicts and exceptions."],
    },
    5: {
      title: "Set org-wide governance",
      description: "Experts set governance strategy so coherence survives reorgs and growth. Example: they define ownership, review gates, and metrics for information quality across a suite.",
      bullets: ["Defines governance strategy, ownership model, and metrics.", "Aligns leadership on enforcement and investment.", "Coaches leads on scaling governance without blocking delivery."],
    },
  }, "Architecture"),
  mkSkillRich("technical-collab", "Technical Collaboration", {
    1: {
      title: "Learn constraints",
      description: "Learners understand that architecture choices have technical constraints and ask the right questions. Example: they confirm what data is available before designing a complex filter experience.",
      bullets: ["Asks about data availability, latency, and permissions early.", "Avoids designing beyond feasible constraints without discussion.", "Documents assumptions for review."],
    },
    2: {
      title: "Collaborate in planning",
      description: "Juniors collaborate with engineers in planning and adjust designs to match reality. Example: they negotiate scope for an MVP while preserving the core workflow.",
      bullets: ["Clarifies trade-offs and updates designs based on constraints.", "Writes clear specs and acceptance criteria.", "Partners on sequencing and risk reduction."],
    },
    3: {
      title: "Drive architecture-quality decisions",
      description: "Practitioners drive decisions that balance UX and technical constraints and anticipate integration risk. Example: they help define API needs and event logging so the UX works reliably.",
      bullets: ["Partners on API/logging needs that support the UX.", "Anticipates integration risks and designs fallbacks.", "Keeps handoffs tight and verifiable."],
    },
    4: {
      title: "Mentor cross-functional teams",
      description: "Advanced architects mentor teams on collaboration patterns that keep complex work moving. Example: they establish shared architecture reviews and a working agreement on decision-making.",
      bullets: ["Mentors designers on collaborating with eng in complex programs.", "Leads shared reviews to align on architecture + UX trade-offs.", "Improves team workflows for predictable delivery."],
    },
    5: {
      title: "Set collaboration strategy",
      description: "Experts set cross-functional collaboration standards across a platform. Example: they define how architecture decisions are made, documented, and enforced so quality scales.",
      bullets: ["Defines org standards for UX-architecture decision-making and documentation.", "Aligns leaders on guardrails and investment.", "Coaches leads on sustaining quality across large programs."],
    },
  }, "Architecture"),
];

const VISUAL_DESIGNER_SKILLS: Skill[] = [
  mkSkillRich("visual-language", "Visual Language & Brand", {
    1: {
      title: "Follow brand guidance",
      description: "Learners apply established brand guidelines and keep visuals consistent. Example: they create a simple header graphic using approved colors and type styles.",
      bullets: ["Uses approved colors, type, and imagery consistently.", "Avoids inventing new styles without review.", "Can explain how the asset supports the message."],
    },
    2: {
      title: "Adapt brand to contexts",
      description: "Juniors adapt brand visuals to new contexts while staying consistent. Example: they create a campaign banner set that works across email and web placements.",
      bullets: ["Creates consistent variations across formats and sizes.", "Balances brand rules with readability and accessibility.", "Takes critique and iterates quickly."],
    },
    3: {
      title: "Own visual direction for a project",
      description: "Practitioners own the visual language for a project or feature set and provide guidelines others can follow. Example: they define a visual motif and ensure assets remain coherent across teams.",
      bullets: ["Defines a visual direction and documents usage guidelines.", "Builds a reusable asset kit for consistent production.", "Coordinates with stakeholders to align on tone and intent."],
    },
    4: {
      title: "Lead visual systems and mentor",
      description: "Advanced designers lead visual systems across multiple initiatives and mentor others through critique. Example: they run reviews to ensure campaigns and product visuals feel like one brand.",
      bullets: ["Leads visual system work across teams; prevents drift.", "Mentors peers on composition, brand expression, and craft.", "Partners with marketing/product leadership on direction."],
    },
    5: {
      title: "Set brand and creative strategy",
      description: "Experts set creative strategy and governance so brand expression scales. Example: they define standards, review processes, and long-term evolution of the brand system.",
      bullets: ["Defines creative strategy, governance, and quality bar for a domain.", "Aligns leaders on brand evolution and trade-offs.", "Coaches leads on creative direction and decision-making."],
    },
  }, "Visual"),
  mkSkillRich("typography", "Typography & Layout", {
    1: {
      title: "Use type safely",
      description: "Learners use approved type styles and basic layout rules (grid, spacing). Example: they create a one-page flyer with clear hierarchy and readable body text.",
      bullets: ["Applies type scale and spacing rules consistently.", "Maintains readability (line length, contrast, spacing).", "Uses grids to align elements cleanly."],
    },
    2: {
      title: "Create hierarchy intentionally",
      description: "Juniors refine hierarchy for clarity and scanning. Example: they redesign a slide deck so key points read first and details support the story.",
      bullets: ["Uses typography and layout to guide attention.", "Improves rhythm and spacing; reduces clutter.", "Explains hierarchy decisions in terms of message and audience."],
    },
    3: {
      title: "Own complex compositions",
      description: "Practitioners handle complex layouts across responsive sizes and formats. Example: they design a landing page hero system that scales across breakpoints while keeping hierarchy intact.",
      bullets: ["Designs responsive layout systems and reusable compositions.", "Balances aesthetics with content density and constraints.", "Provides specs that others can reproduce accurately."],
    },
    4: {
      title: "Mentor and standardize",
      description: "Advanced designers mentor teams on typography and create reusable layout templates. Example: they establish a deck template system that improves consistency across the org.",
      bullets: ["Leads critiques focused on hierarchy, readability, and rhythm.", "Creates templates and guidance to scale quality.", "Partners with stakeholders to ensure content supports design."],
    },
    5: {
      title: "Set craft bar for communication",
      description: "Experts set typography and layout standards that define the brand’s communication quality. Example: they establish governance for templates and ensure consistency across high-visibility work.",
      bullets: ["Defines standards and governance for typography/layout across a domain.", "Aligns leaders on quality expectations and enforcement.", "Coaches leads on craft strategy and scaling templates."],
    },
  }, "Visual"),
  mkSkillRich("color-theming", "Color Theory", {
    1: {
      title: "Use palette correctly",
      description: "Learners use approved palettes and check contrast. Example: they create social graphics using the correct color roles and avoid low-contrast combinations.",
      bullets: ["Uses semantic color roles; avoids random color choices.", "Checks basic contrast and accessibility considerations.", "Maintains consistency across related assets."],
    },
    2: {
      title: "Support hierarchy with color",
      description: "Juniors use color to support hierarchy and meaning, not decoration. Example: they adjust a campaign set so calls-to-action stand out without violating brand rules.",
      bullets: ["Uses color intentionally for emphasis and grouping.", "Maintains consistent color usage across a set of assets.", "Documents color decisions for review."],
    },
    3: {
      title: "Design scalable color systems",
      description: "Practitioners design color systems that scale across contexts and themes. Example: they define light/dark variants and guidelines for imagery overlays.",
      bullets: ["Defines scalable color roles and theme variants.", "Partners with engineering on implementation constraints when needed.", "Balances brand expression with accessibility and clarity."],
    },
    4: {
      title: "Mentor and govern color usage",
      description: "Advanced designers mentor teams and govern color usage to prevent drift. Example: they standardize color roles across product and marketing so the brand feels unified.",
      bullets: ["Leads governance and reviews to prevent inconsistent color usage.", "Mentors designers on color theory and accessibility trade-offs.", "Improves adoption of shared palettes and roles."],
    },
    5: {
      title: "Set color strategy",
      description: "Experts set color strategy aligned to brand and usability outcomes. Example: they guide brand evolution and ensure color decisions support trust, clarity, and accessibility.",
      bullets: ["Defines color strategy and governance across a domain.", "Aligns leaders on brand vs usability trade-offs.", "Coaches leads on long-term system stewardship."],
    },
  }, "Visual"),
  mkSkillRich("icon-illustration", "Iconography & Illustration", {
    1: {
      title: "Use existing assets",
      description: "Learners use existing icons and illustration styles consistently. Example: they select the correct icon from the library and avoid custom one-offs.",
      bullets: ["Uses icon library and style guidance accurately.", "Maintains consistent stroke, corner radius, and sizing.", "Asks before creating net-new assets."],
    },
    2: {
      title: "Create within the style",
      description: "Juniors can create new icons/illustrations that match the system with review. Example: they add three new icons for a feature while keeping style consistent.",
      bullets: ["Creates new icons within established style and grid.", "Documents usage guidance and meaning for new assets.", "Iterates based on critique quickly."],
    },
    3: {
      title: "Own asset systems",
      description: "Practitioners own an asset system for a product or campaign and ensure consistency across teams. Example: they build an icon set for an initiative and manage contributions.",
      bullets: ["Defines icon/illustration guidelines and templates.", "Manages contributions and prevents inconsistent additions.", "Partners with dev/marketing to ensure assets ship correctly."],
    },
    4: {
      title: "Mentor and scale asset quality",
      description: "Advanced designers mentor teams on asset creation and scale production through templates and governance. Example: they create a production workflow that keeps assets consistent under time pressure.",
      bullets: ["Mentors designers on asset craft and consistency.", "Builds templates/workflows for scalable production.", "Leads reviews to keep assets coherent across initiatives."],
    },
    5: {
      title: "Set creative direction for assets",
      description: "Experts set the direction and governance for iconography/illustration across the org. Example: they define principles and review processes so assets evolve coherently over time.",
      bullets: ["Defines org-wide direction and governance for icon/illustration systems.", "Aligns leaders on investment and evolution of the style.", "Coaches leads on maintaining coherence at scale."],
    },
  }, "Visual"),
  mkSkillRich("storytelling-assets", "Storytelling", {
    1: {
      title: "Support a clear story",
      description: "Learners create basic slides and visuals that support a narrative. Example: they turn a rough outline into a clean slide with readable hierarchy and consistent styling.",
      bullets: ["Uses templates and keeps slides readable and consistent.", "Chooses visuals that support the point (not decoration).", "Applies basic data viz hygiene when charting."],
    },
    2: {
      title: "Make narratives easier to grasp",
      description: "Juniors improve decks and artifacts so leaders can scan and understand quickly. Example: they redesign a roadmap deck to highlight decisions and risks on a single page.",
      bullets: ["Uses hierarchy and layout to make key messages obvious.", "Improves consistency across multi-slide narratives.", "Handles feedback and revisions efficiently."],
    },
    3: {
      title: "Own high-stakes communication",
      description: "Practitioners own high-stakes storytelling artifacts and tailor them to the audience. Example: they build an exec-ready narrative that clarifies trade-offs and next steps.",
      bullets: ["Tailors visuals and narrative to specific stakeholders.", "Synthesizes complexity into clear, defensible visuals.", "Ensures artifacts can be reused and updated over time."],
    },
    4: {
      title: "Mentor and standardize storytelling",
      description: "Advanced designers mentor teams on storytelling and build reusable templates and standards. Example: they create a set of narrative templates for product reviews and ensure adoption.",
      bullets: ["Mentors teams on narrative structure and visual clarity.", "Creates templates that scale quality across the org.", "Leads reviews for high-visibility communications."],
    },
    5: {
      title: "Set communication strategy",
      description: "Experts set the strategy for visual communication across a domain and ensure quality is repeatable. Example: they establish governance for executive communications and coach leaders on narrative clarity.",
      bullets: ["Defines standards and governance for high-visibility visual communications.", "Aligns leaders on messaging, tone, and quality expectations.", "Coaches leads on narrative trade-offs and clarity."],
    },
  }, "Visual"),
  mkSkillRich("motion-brand", "Motion & Visual Rhythm", {
    1: {
      title: "Use motion carefully",
      description: "Learners use simple motion patterns that clarify state change. Example: they create a subtle animated logo reveal that doesn’t distract or cause accessibility issues.",
      bullets: ["Uses approved motion patterns and keeps motion purposeful.", "Avoids excessive animation and respects reduced-motion needs.", "Documents intent for review."],
    },
    2: {
      title: "Design motion for comprehension",
      description: "Juniors use motion to improve comprehension and brand expression in a controlled way. Example: they animate a transition that explains a before/after state without overwhelming the viewer.",
      bullets: ["Uses timing and easing intentionally for clarity.", "Keeps motion consistent across an asset set.", "Collaborates with video/engineering to implement correctly."],
    },
    3: {
      title: "Own motion direction for a set",
      description: "Practitioners own motion direction for a campaign or product moment and provide specs/templates. Example: they define motion guidelines for a series of promo assets.",
      bullets: ["Defines motion principles, durations, and style guidance.", "Creates reusable templates for scalable production.", "Balances delight with clarity, performance, and accessibility."],
    },
    4: {
      title: "Mentor and standardize motion",
      description: "Advanced designers mentor others on motion and standardize patterns so motion stays coherent across work. Example: they create a motion library and review cadence.",
      bullets: ["Mentors teams on motion best practices and critique.", "Builds a reusable motion library and governance.", "Ensures motion supports brand and usability outcomes."],
    },
    5: {
      title: "Set motion strategy",
      description: "Experts set motion strategy aligned to brand and accessibility standards. Example: they define motion governance and coach leaders on how motion should evolve across products and campaigns.",
      bullets: ["Defines motion strategy, governance, and quality bar across a domain.", "Aligns leaders on trade-offs and enforcement.", "Coaches leads on scaling motion practices."],
    },
  }, "Visual"),
  mkSkillRich("creative-direction", "Creative Direction", {
    1: {
      title: "Participate in critique",
      description: "Learners can receive critique, iterate, and explain basic choices. Example: they revise a set of assets after feedback and keep consistency intact.",
      bullets: ["Receives feedback well and iterates without losing consistency.", "Explains choices using basic design principles.", "Keeps assets organized and reproducible."],
    },
    2: {
      title: "Give useful critique",
      description: "Juniors give constructive critique and help peers improve craft. Example: they review a deck and point out specific hierarchy issues with actionable suggestions.",
      bullets: ["Gives specific, actionable feedback tied to principles.", "Helps maintain consistency across shared work.", "Coordinates with stakeholders on revisions."],
    },
    3: {
      title: "Lead creative reviews",
      description: "Practitioners lead creative reviews and align stakeholders on direction and trade-offs. Example: they run a review to decide between two visual directions based on goals and constraints.",
      bullets: ["Leads critique sessions that end in decisions and next steps.", "Aligns stakeholders on direction using clear criteria.", "Manages scope and revisions to hit deadlines without quality collapse."],
    },
    4: {
      title: "Mentor and scale creative quality",
      description: "Advanced designers mentor others and scale creative quality through standards and templates. Example: they establish a critique cadence and maintain a living style guide.",
      bullets: ["Mentors teams on craft and decision-making.", "Establishes critique cadence and standard templates for consistency.", "Protects quality while managing stakeholder pressure."],
    },
    5: {
      title: "Set creative governance",
      description: "Experts set creative governance so quality and coherence scale beyond one person. Example: they define ownership, review gates, and evolution plans for the brand system.",
      bullets: ["Defines governance, ownership, and quality standards for creative work.", "Aligns leadership on brand evolution and investment.", "Coaches leads on sustaining creative excellence at scale."],
    },
  }, "Visual"),
];

// Specialty registries
const SPECIALTY_SKILLS: Record<string, Skill[]> = {
  strategist: STRATEGIST_SKILLS,
  "ui-designer": UI_DESIGNER_SKILLS,
  "ux-architect": UX_ARCHITECT_SKILLS,
  "visual-designer": VISUAL_DESIGNER_SKILLS,
};

const SPECIALTY_LABELS: Record<string, string> = {
  strategist: "Strategist",
  "ui-designer": "UI Designer",
  "ux-architect": "UX Architect",
  "visual-designer": "Visual Designer",
};

const SPECIALTY_OPTIONS = [
  { value: "strategist", label: "Strategist" },
  { value: "ui-designer", label: "UI Designer" },
  { value: "ux-architect", label: "UX Architect" },
  { value: "visual-designer", label: "Visual Designer" },
  { value: "none", label: "None" },
];


/** ---------- Small UI Components ---------- */

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-black/80 shadow-sm">
      {children}
    </span>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="grid gap-1.5">
      <div className="text-xs text-black/60">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-black/15 bg-white/95 px-3 py-2.5 text-sm outline-none focus:border-black/25"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function CardShell({
  title,
  subtitle,
  right,
  children,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white/80 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.06)]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-lg font-black">{title}</div>
          {subtitle ? <div className="mt-1 text-sm text-black/60">{subtitle}</div> : null}
        </div>
        {right}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}


function DetailsPanel({ skill, level }: { skill: Skill | null; level: Level | null }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm">
      <div className="flex items-baseline justify-between gap-6">
        <div className="text-xs font-extrabold tracking-wide text-black/60">SELECTED COMPETENCY</div>
        <div className="text-xs font-extrabold tracking-wide text-black/60">LEVEL</div>
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto] items-start gap-4 border-t border-black/10 pt-4">
        <div className="min-w-0">
          {skill?.category ? (
            <div className="text-[11px] font-extrabold uppercase tracking-wide text-black/50">{skill.category}</div>
          ) : null}
          <div className="mt-1 text-lg font-black leading-tight text-black/90">{skill?.label ?? "—"}</div>
        </div>

        <div className="whitespace-nowrap pt-0.5 text-right text-sm font-extrabold text-black/85">
          {level ? `${LEVEL_LABELS[level]} (${level})` : "Not set"}
        </div>
      </div>

      <div className="mt-3">
        {skill && level && skill.levels[level] ? (
          <>
            <div className="text-sm font-extrabold text-black/80">{skill.levels[level].title}</div>
            <div className="mt-2 text-sm leading-relaxed text-black/75">{skill.levels[level].description}</div>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-black/70">
              {skill.levels[level].bullets.map((b, idx) => (
                <li key={idx}>{b}</li>
              ))}
            </ul>
          </>
        ) : (
          <div className="text-sm leading-relaxed text-black/65">Hover a lane to preview. Click a bar to set a level (1–5).</div>
        )}
      </div>
    </div>
  );
}

/** ---------- Visualization ---------- */

type VizMode = "radar" | "polar";

function VizToggle({ mode, setMode }: { mode: VizMode; setMode: (m: VizMode) => void }) {
  return (
    <div className="inline-flex rounded-full border border-black/10 bg-white/70 p-1 shadow-sm">
      <button
        type="button"
        onClick={() => setMode("radar")}
        className={
          "rounded-full px-3 py-1 text-xs font-extrabold transition " +
          (mode === "radar" ? "bg-emerald-200/70 text-black/85" : "text-black/70 hover:bg-black/[0.04]")
        }
      >
        Radar
      </button>
      <button
        type="button"
        onClick={() => setMode("polar")}
        className={
          "rounded-full px-3 py-1 text-xs font-extrabold transition " +
          (mode === "polar" ? "bg-emerald-200/70 text-black/85" : "text-black/70 hover:bg-black/[0.04]")
        }
      >
        Polar
      </button>
    </div>
  );
}

function ProficiencyVisualized({
  title,
  skills,
  selections,
  embedded = false,
  variant = "small",
}: {
  title: string;
  skills: Skill[];
  selections: Selections;
  embedded?: boolean;
  variant?: "small" | "large";
}) {
  const [mode, setMode] = useState<VizMode>("radar");
  const maxW = variant === "large" ? "max-w-[1040px]" : "max-w-[560px]";

  // Use container-driven sizing (SVG is 100% x 100%).
  const Inner = (
    <div className={embedded ? "w-full" : "rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm"}>
      <div className="flex items-baseline justify-between gap-4">
        <div className="text-xs font-extrabold tracking-wide text-black/60">PROFICIENCY VISUALIZED</div>
        <VizToggle mode={mode} setMode={setMode} />
      </div>

      <div className="mt-4 grid place-items-center">
        <div className={"w-full aspect-square " + maxW + " overflow-visible rounded-2xl bg-white/40 p-8"}>
          <div className="h-full w-full">
          {mode === "radar" ? (
            <RadarChart title={title} skills={skills} selections={selections} showCenter={false} />
          ) : (
            <PolarChart title={title} skills={skills} selections={selections} showCenter={false} />
          )}
        </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-black/55">Shows your current selections (unset competencies render at 0).</div>
    </div>
  );

  return Inner;
}

function RadarChart({
  title,
  skills,
  selections,
  showCenter,
}: {
  title: string;
  skills: Skill[];
  selections: Selections;
  showCenter: boolean;
}) {
  // Responsive: SVG fills parent square.
  const size = 520;
  const pad = 120;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 200;
  const rings = 5;

  const n = Math.max(3, skills.length);
  const angleStep = (Math.PI * 2) / n;
  const start = -Math.PI / 2;

  const points = skills.map((s, i) => {
    const lvl = selections[s.id] ?? 0;
    const r = (lvl / 5) * maxR;
    const a = start + i * angleStep;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });

  const poly = points.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");

  function labelPos(i: number) {
    const a = start + i * angleStep;
    const r = maxR + 24;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), a };
  }

  return (
    <svg
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      viewBox={`${-pad} ${-pad} ${size + pad * 2} ${size + pad * 2}`}
      className="block overflow-visible"
    >
      {Array.from({ length: rings }, (_, i) => {
        const lvl = (i + 1) as Level;
        const r = (maxR * (i + 1)) / rings;
        return (
          <g key={lvl}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,0.08)" />
            <text x={cx + r + 6} y={cy + 4} fontSize={12} fill="rgba(0,0,0,0.45)" fontWeight={700}>
              {lvl}
            </text>
          </g>
        );
      })}

      {skills.map((s, i) => {
        const a = start + i * angleStep;
        const x2 = cx + maxR * Math.cos(a);
        const y2 = cy + maxR * Math.sin(a);
        const lp = labelPos(i);

        const anchor = Math.abs(Math.cos(lp.a)) < 0.25 ? "middle" : Math.cos(lp.a) > 0 ? "start" : "end";

        return (
          <g key={s.id}>
            <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="rgba(0,0,0,0.08)" />
            <text x={lp.x} y={lp.y} textAnchor={anchor} dominantBaseline="middle" fontSize={12} fill="rgba(0,0,0,0.72)" fontWeight={700}>
              {s.label}
            </text>
          </g>
        );
      })}

      <polygon points={poly} fill="rgba(16,185,129,0.22)" stroke="rgba(16,185,129,0.62)" strokeWidth={2} />

      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="rgba(16,185,129,0.70)" stroke="rgba(16,185,129,0.95)" />
      ))}

      {showCenter ? (
        <>
          <circle cx={cx} cy={cy} r={44} fill="rgba(15,23,42,0.92)" />
          <text x={cx} y={cy + 6} textAnchor="middle" fontSize={14} fill="white" fontWeight={800}>
            {title}
          </text>
        </>
      ) : null}
    </svg>
  );
}

function arcPath(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number) {
  const large = a1 - a0 > Math.PI ? 1 : 0;

  const x0o = cx + r1 * Math.cos(a0);
  const y0o = cy + r1 * Math.sin(a0);
  const x1o = cx + r1 * Math.cos(a1);
  const y1o = cy + r1 * Math.sin(a1);

  const x0i = cx + r0 * Math.cos(a1);
  const y0i = cy + r0 * Math.sin(a1);
  const x1i = cx + r0 * Math.cos(a0);
  const y1i = cy + r0 * Math.sin(a0);

  return [
    `M ${x0o} ${y0o}`,
    `A ${r1} ${r1} 0 ${large} 1 ${x1o} ${y1o}`,
    `L ${x0i} ${y0i}`,
    `A ${r0} ${r0} 0 ${large} 0 ${x1i} ${y1i}`,
    "Z",
  ].join(" ");
}

function PolarChart({
  title,
  skills,
  selections,
  showCenter,
}: {
  title: string;
  skills: Skill[];
  selections: Selections;
  showCenter: boolean;
}) {
  const size = 520;
  const pad = 120;
  const cx = size / 2;
  const cy = size / 2;
  const innerR = 70;
  const outerR = 245;

  const n = Math.max(1, skills.length);
  const angle = (Math.PI * 2) / n;
  const start = -Math.PI / 2;

  function labelPos(i: number) {
    const a = start + (i + 0.5) * angle;
    const r = outerR + 22;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), a };
  }

  return (
    <svg
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      viewBox={`${-pad} ${-pad} ${size + pad * 2} ${size + pad * 2}`}
      className="block overflow-visible"
    >
      {[1, 2, 3, 4, 5].map((lvl) => {
        const r = innerR + ((outerR - innerR) * lvl) / 5;
        return (
          <g key={lvl}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,0.08)" />
            <text x={cx + r + 6} y={cy + 4} fontSize={12} fill="rgba(0,0,0,0.45)" fontWeight={700}>
              {lvl}
            </text>
          </g>
        );
      })}

      {skills.map((s, i) => {
        const a0 = start + i * angle;
        const a1 = a0 + angle;
        const d = arcPath(cx, cy, innerR, outerR, a0, a1);
        return <path key={`bg-${s.id}`} d={d} fill="rgba(0,0,0,0.02)" stroke="rgba(0,0,0,0.08)" strokeWidth={1} />;
      })}

      {skills.map((s, i) => {
        const lvl = selections[s.id] ?? 0;
        const r1 = innerR + ((outerR - innerR) * lvl) / 5;
        const a0 = start + i * angle;
        const a1 = a0 + angle;
        const d = arcPath(cx, cy, innerR, r1, a0, a1);

        return (
          <path key={s.id} d={d} fill="rgba(16,185,129,0.22)" stroke="rgba(16,185,129,0.60)" strokeWidth={1.2}>
            <title>
              {s.label}: {lvl ? `${LEVEL_LABELS[lvl as Level]} (${lvl})` : "Not set"}
            </title>
          </path>
        );
      })}

      {skills.map((s, i) => {
        const lp = labelPos(i);
        const anchor = Math.abs(Math.cos(lp.a)) < 0.25 ? "middle" : Math.cos(lp.a) > 0 ? "start" : "end";
        return (
          <text key={`lbl-${s.id}`} x={lp.x} y={lp.y} textAnchor={anchor} dominantBaseline="middle" fontSize={12} fill="rgba(0,0,0,0.72)" fontWeight={700}>
            {s.label}
          </text>
        );
      })}

      {showCenter ? (
        <>
          <circle cx={cx} cy={cy} r={48} fill="rgba(15,23,42,0.92)" />
          <text x={cx} y={cy + 6} textAnchor="middle" fontSize={14} fill="white" fontWeight={800}>
            {title}
          </text>
        </>
      ) : null}
    </svg>
  );
}

/** ---------- Lane Chart ---------- */

function LaneChart({
  title,
  subtitle,
  skills,
  selections,
  setSelections,
  storageKey,
  vizTitle,
}: {
  title: string;
  subtitle: string;
  skills: Skill[];
  selections: Selections;
  setSelections: React.Dispatch<React.SetStateAction<Selections>>;
  storageKey: string;
  vizTitle: string;
}) {
  const [activeSkillId, setActiveSkillId] = useState<string>(skills[0]?.id ?? "");
  const [hoverPreview, setHoverPreview] = useState<{ skillId: string; level: Level } | null>(null);
  const [viewMode, setViewMode] = useState<"edit" | "visualize">("edit");
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const activeSkill = useMemo(() => skills.find((s) => s.id === activeSkillId) ?? null, [skills, activeSkillId]);
  const selectedLevel = (activeSkill ? selections[activeSkill.id] : undefined) ?? null;

  const coverage = useMemo(() => {
    const total = skills.length;
    const filled = skills.reduce((acc, s) => acc + (selections[s.id] ? 1 : 0), 0);
    return { total, filled };
  }, [skills, selections]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(selections));
    } catch {}
  }, [selections, storageKey]);

  function setLevel(skillId: string, level: Level) {
    setSelections((prev) => ({ ...prev, [skillId]: level }));
    setActiveSkillId(skillId);
  }

  function focusLane(skillId: string) {
    setActiveSkillId(skillId);
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const lane = scroller.querySelector<HTMLElement>(`[data-skill="${skillId}"]`);
    if (!lane) return;
    const laneRect = lane.getBoundingClientRect();
    const scRect = scroller.getBoundingClientRect();
    if (laneRect.left < scRect.left || laneRect.right > scRect.right) {
      lane.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }

  const detailsLevel: Level | null = (selectedLevel ?? (hoverPreview && hoverPreview.skillId === activeSkillId ? hoverPreview.level : null)) as Level | null;
  const columns = skills.length;

  return (
    <CardShell
      title={title}
      subtitle={subtitle}
      right={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === "edit" ? "visualize" : "edit")}
            className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-extrabold text-black/80 shadow-sm transition hover:bg-black/[0.04]"
          >
            {viewMode === "edit" ? "Visualize" : "Back"}
          </button>
          <Chip>
            Coverage: <span className="font-extrabold">{coverage.filled}</span>/{coverage.total}
          </Chip>
        </div>
      }
    >
      {viewMode === "visualize" ? (
        <div className="space-y-4">
                    <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
            <div className="text-xs font-extrabold tracking-wide text-black/60">CHARTS</div>
            <div className="mt-3">
              <ProficiencyVisualized title={vizTitle} skills={skills} selections={selections} embedded variant="large" />
            </div>
            <div className="mt-3 text-xs text-black/55">Manager view: quick glance of strengths and gaps. Select Back to edit levels.</div>
          </div>
        </div>
      ) : (
        <>
          
          {/* Lanes */}
          <div className="mt-4 rounded-2xl border border-black/10 bg-white/70 p-4">
            <div
              className="relative -mx-4 overflow-x-auto px-4 pb-2"
              ref={scrollerRef}
              style={{ scrollbarGutter: "stable both-edges" }}
            >
              <div className="min-w-[860px]">
                <div className="grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(150px, 1fr))` }}>
                  {skills.map((skill) => {
                    const isActive = skill.id === activeSkillId;
                    const selected = selections[skill.id] ?? null;

                    return (
                      <button
                        key={skill.id}
                        data-skill={skill.id}
                        type="button"
                        className={
                          "group relative flex flex-col gap-1 rounded-xl px-2 py-2 text-left outline-none " +
                          (isActive ? "bg-emerald-50/60 ring-1 ring-emerald-200/70" : "hover:bg-black/[0.03]")
                        }
                        onMouseEnter={() => {
                          setActiveSkillId(skill.id);
                          setHoverPreview(null);
                        }}
                        onMouseLeave={() => setHoverPreview(null)}
                        onClick={() => focusLane(skill.id)}
                      >
                        <div className="h-[3rem] overflow-hidden text-sm font-extrabold leading-tight break-words text-black/85">{skill.label}</div>

                        {/* Track */}
                        <div
                          className="relative h-11 rounded-xl border border-black/10 bg-white/70"
                          onMouseMove={(e) => {
                            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const pct = clamp(x / rect.width, 0, 1);
                            const raw = Math.round(pct * 4) + 1; // 1..5
                            setHoverPreview({ skillId: skill.id, level: clamp(raw, 1, 5) as Level });
                          }}
                          onMouseLeave={() => setHoverPreview(null)}
                          onClick={(e) => {
                            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const pct = clamp(x / rect.width, 0, 1);
                            const raw = Math.round(pct * 4) + 1;
                            const lvl = clamp(raw, 1, 5) as Level;
                            setLevel(skill.id, lvl);
                          }}
                          title="Click to set level (Learner → Expert)"
                        >
                          {/* segments */}
                          <div className="absolute inset-0 grid grid-cols-5 overflow-hidden rounded-xl">
                            {LEVELS.map((lvl) => (
                              <div
                                key={lvl}
                                className={"border-r border-black/5 last:border-r-0 " + (lvl % 2 === 0 ? "bg-emerald-50/35" : "bg-slate-50/70")}
                              />
                            ))}
                          </div>

                          {/* hover marker */}
                          {isActive && hoverPreview && hoverPreview.skillId === skill.id && (
                            <div
                              className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-emerald-300/70 bg-emerald-100/60"
                              style={{ left: `calc(${((hoverPreview.level - 1) / 4) * 100}% - 8px)` }}
                            />
                          )}

                          {/* selected marker */}
                          {selected && (
                            <div
                              className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-emerald-400/70 bg-emerald-200/60 shadow-sm transition-transform group-hover:scale-[1.03]"
                              style={{ left: `calc(${((selected - 1) / 4) * 100}% - 8px)` }}
                            />
                          )}
                        </div>

                        <div className="mt-1 text-xs text-black/55">
                          {selected ? (
                            <span>
                              <span className="font-bold text-black/70">{LEVEL_LABELS[selected]}</span>{" "}
                              <span className="text-black/50">({selected})</span>
                            </span>
                          ) : (
                            <span className="text-black/45">Not set</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs text-black/55">Tip: Hover a lane to preview. Click the bar to set level (1–5).</div>
          </div>

          {/* Two half-width cards */}
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <DetailsPanel skill={activeSkill} level={detailsLevel} />
            <ProficiencyVisualized title={vizTitle} skills={skills} selections={selections} />
          </div>
        </>
      )}
    </CardShell>
  );
}

/** ---------- Page ---------- */

export default function DesignSkillsMatrix() {
  const [domain, setDomain] = useState("product-design");
  const [specialty, setSpecialty] = useState<"strategist" | "ui-designer" | "ux-architect" | "visual-designer" | "none">("strategist");

  const [baselineSelections, setBaselineSelections] = useState<Selections>({});
  const [strategistSelections, setStrategistSelections] = useState<Selections>({});
  const [uiDesignerSelections, setUiDesignerSelections] = useState<Selections>({});
  const [uxArchitectSelections, setUxArchitectSelections] = useState<Selections>({});
  const [visualDesignerSelections, setVisualDesignerSelections] = useState<Selections>({});

  useEffect(() => {
    const baseRaw = safeJsonParse<Selections>(localStorage.getItem(STORAGE_KEY_BASE));
    setBaselineSelections(normalizeSelections(baseRaw, BASELINE_SKILLS));

    const strategistRaw = safeJsonParse<Selections>(localStorage.getItem(STORAGE_KEY_SPEC_STRATEGIST));
    setStrategistSelections(normalizeSelections(strategistRaw, STRATEGIST_SKILLS));

    const uiRaw = safeJsonParse<Selections>(localStorage.getItem(STORAGE_KEY_SPEC_UI_DESIGNER));
    setUiDesignerSelections(normalizeSelections(uiRaw, UI_DESIGNER_SKILLS));

    const archRaw = safeJsonParse<Selections>(localStorage.getItem(STORAGE_KEY_SPEC_UX_ARCHITECT));
    setUxArchitectSelections(normalizeSelections(archRaw, UX_ARCHITECT_SKILLS));

    const visRaw = safeJsonParse<Selections>(localStorage.getItem(STORAGE_KEY_SPEC_VISUAL_DESIGNER));
    setVisualDesignerSelections(normalizeSelections(visRaw, VISUAL_DESIGNER_SKILLS));
  }, []);

  const baselineCoverage = useMemo(() => {
    const total = BASELINE_SKILLS.length;
    const filled = BASELINE_SKILLS.reduce((acc, s) => acc + (baselineSelections[s.id] ? 1 : 0), 0);
    return { total, filled };
  }, [baselineSelections]);

  const specialtyCoverage = useMemo(() => {
    if (specialty === "none") return null;
    const skills = SPECIALTY_SKILLS[specialty];
    const selections = specialty === "strategist" ? strategistSelections : specialty === "ui-designer" ? uiDesignerSelections : specialty === "ux-architect" ? uxArchitectSelections : visualDesignerSelections;
    const total = skills.length;
    const filled = skills.reduce((acc, s) => acc + (selections[s.id] ? 1 : 0), 0);
    return { total, filled };
  }, [specialty, strategistSelections, uiDesignerSelections, uxArchitectSelections, visualDesignerSelections]);

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_500px_at_20%_-10%,rgba(16,185,129,0.10),rgba(255,255,255,0)),radial-gradient(900px_400px_at_100%_10%,rgba(15,23,42,0.08),rgba(255,255,255,0))] px-5 py-7">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-black/90">Design Skills Matrix</h1>
            <p className="mt-1 text-sm text-black/65">Five-level proficiency per competency (Learner → Expert). Baseline + role depth.</p>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <Chip>
              Baseline: <span className="font-extrabold">{baselineCoverage.filled}</span>/{baselineCoverage.total}
            </Chip>
            {specialty !== "none" && specialtyCoverage && (
              <Chip>
                {SPECIALTY_LABELS[specialty]}: <span className="font-extrabold">{specialtyCoverage.filled}</span>/{specialtyCoverage.total}
              </Chip>
            )}
          </div>
        </div>

        <div className="mt-4 grid max-w-xl grid-cols-2 gap-3">
          <Select label="Domain" value={domain} onChange={setDomain} options={[{ value: "product-design", label: "Product Design" }]} />
          <Select
            label="Specialty"
            value={specialty}
            onChange={(v) => setSpecialty(v as any)}
            options={SPECIALTY_OPTIONS}
          />
        </div>

        <div className="mt-6 space-y-5">
          <LaneChart
            title="Design Competency"
            subtitle="These specific proficiencies illustrate your competency within the Design field"
            skills={BASELINE_SKILLS}
            selections={baselineSelections}
            setSelections={setBaselineSelections}
            storageKey={STORAGE_KEY_BASE}
            vizTitle="Baseline"
          />

          {specialty !== "none" && (
            <LaneChart
              title={`${SPECIALTY_LABELS[specialty]} (specialty)`}
              subtitle="Use this area to gauge competence within your specific field"
              skills={SPECIALTY_SKILLS[specialty]}
              selections={
                specialty === "strategist"
                  ? strategistSelections
                  : specialty === "ui-designer"
                    ? uiDesignerSelections
                    : specialty === "ux-architect"
                      ? uxArchitectSelections
                      : visualDesignerSelections
              }
              setSelections={
                specialty === "strategist"
                  ? setStrategistSelections
                  : specialty === "ui-designer"
                    ? setUiDesignerSelections
                    : specialty === "ux-architect"
                      ? setUxArchitectSelections
                      : setVisualDesignerSelections
              }
              storageKey={
                specialty === "strategist"
                  ? STORAGE_KEY_SPEC_STRATEGIST
                  : specialty === "ui-designer"
                    ? STORAGE_KEY_SPEC_UI_DESIGNER
                    : specialty === "ux-architect"
                      ? STORAGE_KEY_SPEC_UX_ARCHITECT
                      : STORAGE_KEY_SPEC_VISUAL_DESIGNER
              }
              vizTitle={SPECIALTY_LABELS[specialty]}
            />
          )}
        </div>

        <div className="mt-5 text-xs text-black/55">
          Note: This stores selections in <span className="font-semibold">localStorage</span>.
        </div>
      </div>
    </div>
  );
}