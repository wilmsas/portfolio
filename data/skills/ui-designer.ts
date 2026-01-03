/**
 * UI Designer Skills
 *
 * Skills for designers focused on user interface craft, visual design systems,
 * interaction patterns, and accessibility. These competencies emphasize pixel-
 * perfect execution, design system stewardship, and visual quality assurance.
 *
 * Includes: UI Foundations, IxD and States, Design Systems, Accessibility,
 * Visual QA, Microinteractions, and Content Strategy.
 */

import { Skill, createSkill } from "./types";

export const uiDesignerSkills: Skill[] = [
  createSkill("ui-craft", "UI Foundations", {
    1: {
      title: "Use patterns correctly",
      description: "Learners can assemble screens using the design system without inventing new patterns. They focus on clear hierarchy—what's primary vs secondary—and avoid cramming. Example: they build a settings page using existing components and ask for feedback on spacing and emphasis.",
      bullets: ["Applies standard components and spacing tokens consistently.", "Uses headings, grouping, and progressive disclosure to reduce cognitive load.", "Flags unclear requirements and asks for review early."],
    },
    2: {
      title: "Refine clarity with feedback",
      description: "Juniors improve layouts by adjusting density, grouping, and emphasis based on critique. They can explain why a layout choice supports a user task, not just that it 'looks better.' Example: they rework an empty state so the next action is obvious and the screen reads in a clean scan path.",
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
  createSkill("interaction-states", "IxD and States", {
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
      description: "Advanced designers lead interaction models that multiple features reuse and coach others on behavioral consistency. Example: they standardize notification and toast behavior across the app so users aren't surprised by inconsistent feedback.",
      bullets: ["Leads interaction models across features; prevents inconsistent behavior.", "Mentors peers on behavior-first thinking and edge-case coverage.", "Partners with PM/eng on sequencing and risk management."],
    },
    5: {
      title: "Define interaction strategy",
      description: "Experts set interaction principles and governance for a product suite. They push for coherent behavior across platforms and ensure the org doesn't ship confusing inconsistencies. Example: they define platform interaction guidelines and enforce them through reviews and system updates.",
      bullets: ["Defines interaction principles and platform guidance for a domain.", "Drives cross-team alignment on behavioral standards and exceptions.", "Coaches leaders on interaction trade-offs under constraints."],
    },
  }),
  createSkill("componentization", "Design Systems", {
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
      description: "Practitioners design reusable patterns and coordinate with engineering for implementation and adoption. Example: they define a new 'empty state' pattern with guidelines and ship it across multiple teams.",
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
  createSkill("accessible-ui", "Accessibility", {
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
  createSkill("visual-qa", "Visual QA", {
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
      description: "Experts define the quality bar and governance for UI implementation across the product suite. Example: they establish acceptance criteria, escalation paths, and shared tooling so quality doesn't depend on heroic effort.",
      bullets: ["Defines org-wide UI quality standards and acceptance criteria.", "Aligns leadership on quality investment and enforcement.", "Coaches leads on scaling quality without slowing delivery."],
    },
  }),
  createSkill("motion-micro", "Microinteractions", {
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
      description: "Advanced designers mentor teams on motion and create reusable motion guidance. Example: they build a motion library for common patterns so teams don't invent inconsistent transitions.",
      bullets: ["Leads creation of reusable motion patterns and guidelines.", "Mentors designers on when motion adds value vs noise.", "Ensures motion choices remain consistent across a product suite."],
    },
    5: {
      title: "Set motion strategy",
      description: "Experts set a motion strategy that supports brand, usability, and accessibility across products. Example: they define motion principles and governance so motion is coherent and defensible in reviews.",
      bullets: ["Defines motion principles, governance, and quality bar for a domain.", "Aligns stakeholders on trade-offs (delight vs clarity vs performance).", "Coaches senior designers/leads on motion strategy and critique."],
    },
  }),
  createSkill("ui-content", "Content Strategy", {
    1: {
      title: "Write clear basics",
      description: "Learners can write straightforward labels, helper text, and empty states using existing tone guidance. Example: they rewrite a button label from 'Submit' to 'Save changes' so intent is obvious.",
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
      description: "Advanced designers mentor teams on writing and establish terminology governance. Example: they create a glossary and enforce it through reviews so the product doesn't drift into inconsistent naming.",
      bullets: ["Leads terminology governance and glossary updates across teams.", "Mentors designers on concise, user-centered writing.", "Ensures content decisions align with brand and accessibility needs."],
    },
    5: {
      title: "Set content strategy",
      description: "Experts set a content strategy for a domain and ensure language supports product strategy and trust. Example: they align leadership on tone, risk language, and consistency standards, then bake it into review and system guidance.",
      bullets: ["Defines content strategy and quality bar for a product area.", "Aligns leaders on tone, trust, and risk language decisions.", "Coaches leads on content trade-offs and scaling governance."],
    },
  }),
];
