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

type SkillLevel = { title: string; bullets: string[] };

type Skill = {
  id: string;
  label: string;
  category?: string;
  levels: Record<Level, SkillLevel>;
};

type Selections = Record<string, Level | undefined>;

const STORAGE_KEY_BASE = "design-skills-matrix:lanes:baseline:v6";
const STORAGE_KEY_SPEC = "design-skills-matrix:lanes:strategist:v6";

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

function mkSkill(id: string, label: string, bullets: string[], category?: string): Skill {
  const mk = (title: string, b: string[]): SkillLevel => ({ title, bullets: b.filter(Boolean) });

  return {
    id,
    label,
    category,
    levels: {
      1: mk(`Understands ${label.toLowerCase()}`, ["Can describe the basics.", bullets[0] ?? "—"]),
      2: mk("Applies with support", ["Contributes with guidance.", bullets[0] ?? "—", bullets[1] ?? "—"]),
      3: mk("Practitioner", ["Independently owns scoped work.", bullets[1] ?? bullets[0] ?? "—", bullets[2] ?? "—"]),
      4: mk("Advanced", ["Leads complex work and mentors others.", bullets[0] ?? "—", bullets[1] ?? "—", bullets[2] ?? "—"]),
      5: mk("Expert", ["Sets standards and drives strategy.", bullets[2] ?? bullets[1] ?? bullets[0] ?? "—"]),
    },
  };
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
  mkSkill("quant-research", "Quantitative research", [
    "Defines and interprets metrics.",
    "Uses funnels/cohorts appropriately.",
    "Partners to instrument telemetry.",
  ]),
  mkSkill("qual-research", "Qual research", [
    "Conducts interviews/observation.",
    "Synthesizes themes into insights.",
    "Improves rigor and reduces bias.",
  ]),
  mkSkill("design-thinking", "Design thinking", [
    "Frames problems and explores options.",
    "Runs diverge/converge pragmatically.",
    "Avoids design theater.",
  ]),
  mkSkill("facilitation", "Facilitation", [
    "Plans sessions that drive decisions.",
    "Manages group dynamics.",
    "Turns outputs into next steps.",
  ]),
  mkSkill("interface-design", "Interface Design", [
    "Applies hierarchy and accessibility.",
    "Uses design systems effectively.",
    "Designs states (empty/loading/error).",
  ]),
  mkSkill("wireframing", "Wireframing", [
    "Rapidly explores solutions.",
    "Chooses fidelity based on risk.",
    "Clarifies structure and behavior.",
  ]),
  mkSkill("user-flows", "User Flows", [
    "Maps end-to-end journeys.",
    "Handles edge cases and errors.",
    "Reduces steps and confusion.",
  ]),
  mkSkill("service-design", "Service Design", [
    "Maps services across people/process/tools.",
    "Identifies pain points and handoffs.",
    "Improves end-to-end outcomes.",
  ]),
  mkSkill("information-architecture", "Information Architecture", [
    "Designs navigation/taxonomy and labeling.",
    "Improves findability.",
    "Creates scalable structures.",
  ]),
  mkSkill("ux-strategy", "UX Strategy", [
    "Connects user needs to outcomes.",
    "Defines success measures.",
    "Aligns stakeholders on priorities.",
  ]),
  mkSkill("agile-methods", "Agile Methods", [
    "Works effectively in iterative delivery.",
    "Right-sizes scope for sprints.",
    "Partners with PM/Eng on sequencing.",
  ]),
];

// Strategist specialty — requested subset list
const STRATEGIST_SKILLS: Skill[] = [
  mkSkill(
    "frontend-dev",
    "Frontend dev",
    ["Understands UI implementation constraints.", "Writes buildable specs.", "Collaborates on feasibility and quality."],
    "Technical"
  ),
  mkSkill("vision-setting", "Vision setting", ["Defines a clear experience vision.", "Aligns to outcomes.", "Creates a usable north star."], "Strategy"),
  mkSkill("roadmapping", "Roadmapping", ["Translates strategy into sequenced work.", "Balances short/long-term value.", "Makes trade-offs explicit."], "Strategy"),
  mkSkill("data-analysis", "Data analysis", ["Interprets product/usage data correctly.", "Detects pitfalls/confounds.", "Uses evidence to drive decisions."], "Research & Insights"),
  mkSkill("artifact-creation", "Artifact creation", ["Creates decision-driving artifacts.", "Keeps artifacts lean and current.", "Ensures artifacts lead to action."], "Research & Insights"),
  mkSkill("business-alignment", "Business alignment", ["Connects UX to business value.", "Understands constraints (risk/cost/policy).", "Balances value with feasibility."], "Business"),
  mkSkill("stakeholder-mgmt", "Stakeholder management", ["Builds alignment across priorities.", "Drives decisions with trade-offs.", "Manages conflict and ambiguity."], "Business"),
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
        <div className={"w-full aspect-square " + maxW}>
          {mode === "radar" ? (
            <RadarChart title={title} skills={skills} selections={selections} showCenter={false} />
          ) : (
            <PolarChart title={title} skills={skills} selections={selections} showCenter={false} />
          )}
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
  const pad = 90;
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
    const r = maxR + 48;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), a };
  }

  return (
    <svg
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      viewBox={`${-pad} ${-pad} ${size + pad * 2} ${size + pad * 2}`}
      className="overflow-visible"
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
  const pad = 90;
  const cx = size / 2;
  const cy = size / 2;
  const innerR = 70;
  const outerR = 245;

  const n = Math.max(1, skills.length);
  const angle = (Math.PI * 2) / n;
  const start = -Math.PI / 2;

  function labelPos(i: number) {
    const a = start + (i + 0.5) * angle;
    const r = outerR + 46;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), a };
  }

  return (
    <svg
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      viewBox={`${-pad} ${-pad} ${size + pad * 2} ${size + pad * 2}`}
      className="overflow-visible"
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
                          "group relative flex flex-col gap-2 rounded-xl px-2 py-2 text-left outline-none " +
                          (isActive ? "bg-emerald-50/60 ring-1 ring-emerald-200/70" : "hover:bg-black/[0.03]")
                        }
                        onMouseEnter={() => {
                          setActiveSkillId(skill.id);
                          setHoverPreview(null);
                        }}
                        onMouseLeave={() => setHoverPreview(null)}
                        onClick={() => focusLane(skill.id)}
                      >
                        <div className="min-h-[2.25rem] text-sm font-extrabold leading-tight text-black/85">{skill.label}</div>

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

            <div className="mt-4 text-xs text-black/55">Tip: Hover a lane to preview. Click the bar to set level (1–5). Selections persist in this browser.</div>
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
  const [specialty, setSpecialty] = useState<"strategist" | "none">("strategist");

  const [baselineSelections, setBaselineSelections] = useState<Selections>({});
  const [strategistSelections, setStrategistSelections] = useState<Selections>({});

  useEffect(() => {
    const baseRaw = safeJsonParse<Selections>(localStorage.getItem(STORAGE_KEY_BASE));
    setBaselineSelections(normalizeSelections(baseRaw, BASELINE_SKILLS));

    const specRaw = safeJsonParse<Selections>(localStorage.getItem(STORAGE_KEY_SPEC));
    setStrategistSelections(normalizeSelections(specRaw, STRATEGIST_SKILLS));
  }, []);

  const baselineCoverage = useMemo(() => {
    const total = BASELINE_SKILLS.length;
    const filled = BASELINE_SKILLS.reduce((acc, s) => acc + (baselineSelections[s.id] ? 1 : 0), 0);
    return { total, filled };
  }, [baselineSelections]);

  const strategistCoverage = useMemo(() => {
    const total = STRATEGIST_SKILLS.length;
    const filled = STRATEGIST_SKILLS.reduce((acc, s) => acc + (strategistSelections[s.id] ? 1 : 0), 0);
    return { total, filled };
  }, [strategistSelections]);

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
            {specialty !== "none" && (
              <Chip>
                Strategist: <span className="font-extrabold">{strategistCoverage.filled}</span>/{strategistCoverage.total}
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
            options={[
              { value: "strategist", label: "Strategist" },
              { value: "none", label: "None" },
            ]}
          />
        </div>

        <div className="mt-6 space-y-5">
          <LaneChart
            title="Design (baseline)"
            subtitle="Core proficiencies (subset)"
            skills={BASELINE_SKILLS}
            selections={baselineSelections}
            setSelections={setBaselineSelections}
            storageKey={STORAGE_KEY_BASE}
            vizTitle="Baseline"
          />

          {specialty !== "none" && (
            <LaneChart
              title="Strategist (specialty)"
              subtitle="Role depth proficiencies (subset)"
              skills={STRATEGIST_SKILLS}
              selections={strategistSelections}
              setSelections={setStrategistSelections}
              storageKey={STORAGE_KEY_SPEC}
              vizTitle="Strategist"
            />
          )}
        </div>

        <div className="mt-5 text-xs text-black/55">
          Note: This stores selections in <span className="font-semibold">localStorage</span>. To persist per-user behind password protection,
          wire selections to your auth/session + database later.
        </div>
      </div>
    </div>
  );
}
