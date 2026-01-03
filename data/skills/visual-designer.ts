/**
 * Visual Designer Skills
 *
 * Skills for designers focused on visual craft, brand expression, and creative
 * direction. These competencies emphasize typography, color, iconography,
 * storytelling, motion, and maintaining visual coherence across products and
 * campaigns.
 *
 * Includes: Visual Language & Brand, Typography & Layout, Color Theory,
 * Iconography & Illustration, Storytelling, Motion & Visual Rhythm, and
 * Creative Direction.
 */

import { Skill, createSkill } from "./types";

export const visualDesignerSkills: Skill[] = [
  createSkill("visual-language", "Visual Language & Brand", {
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
  createSkill("typography", "Typography & Layout", {
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
      description: "Experts set typography and layout standards that define the brand's communication quality. Example: they establish governance for templates and ensure consistency across high-visibility work.",
      bullets: ["Defines standards and governance for typography/layout across a domain.", "Aligns leaders on quality expectations and enforcement.", "Coaches leads on craft strategy and scaling templates."],
    },
  }, "Visual"),
  createSkill("color-theming", "Color Theory", {
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
  createSkill("icon-illustration", "Iconography & Illustration", {
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
  createSkill("storytelling-assets", "Storytelling", {
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
  createSkill("motion-brand", "Motion & Visual Rhythm", {
    1: {
      title: "Use motion carefully",
      description: "Learners use simple motion patterns that clarify state change. Example: they create a subtle animated logo reveal that doesn't distract or cause accessibility issues.",
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
  createSkill("creative-direction", "Creative Direction", {
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
