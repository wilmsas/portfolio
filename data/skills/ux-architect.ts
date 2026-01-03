/**
 * UX Architect Skills
 *
 * Skills for architects focused on structure, scalability, and system-level
 * design. These competencies emphasize information architecture, cross-system
 * coordination, complexity reduction, and establishing governance that ensures
 * coherence as products scale.
 *
 * Includes: Information Architecture, Information modeling, Pattern Strategy
 * & Systems, Cross-System Journeys, Complexity Reduction, Documentation &
 * Governance, and Technical Collaboration.
 */

import { Skill, createSkill } from "./types";

export const uxArchitectSkills: Skill[] = [
  createSkill("ia-taxonomy", "Information Architecture", {
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
  createSkill("info-modeling", "Information modeling", {
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
  createSkill("patterns-system", "Pattern Strategy & Systems", {
    1: {
      title: "Use patterns consistently",
      description: "Learners apply existing patterns and document when a need doesn't fit. Example: they reuse a standard wizard pattern instead of designing a bespoke flow.",
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
  createSkill("cross-system", "Cross-System Journeys", {
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
  createSkill("complexity-reduction", "Complexity Reduction", {
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
  createSkill("documentation-governance", "Documentation & Governance", {
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
  createSkill("technical-collab", "Technical Collaboration", {
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
