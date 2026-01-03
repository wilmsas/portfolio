/**
 * ProficiencyVisualized Component
 *
 * This component displays a visual representation of skill proficiency using either
 * a radar chart or a polar (circular) chart. Users can toggle between the two views.
 *
 * Features:
 * - Radar chart: Traditional spider/radar chart showing all skills on radial axes
 * - Polar chart: Circular segmented chart showing skills as wedges
 * - Toggle between visualization modes
 * - Supports both small (560px) and large (1040px) variants
 * - Can be embedded without card styling
 */

"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import type { Level, Skill, Selections } from "@/data/skills/types";
import { LEVEL_LABELS } from "@/data/skills/types";

type VizMode = "radar" | "polar";

/**
 * Toggle button to switch between radar and polar visualization modes
 */
function VizToggle({ mode, setMode }: { mode: VizMode; setMode: (m: VizMode) => void }) {
  return (
    <div className="inline-flex rounded-full border border-border bg-card ">
      <button
        type="button"
        onClick={() => setMode("radar")}
        className={
          "rounded-full px-5 py-2 text-sm font-extrabold transition " +
          (mode === "radar" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent")
        }
      >
        Radar
      </button>
      <button
        type="button"
        onClick={() => setMode("polar")}
        className={
          "rounded-full px-5 py-2 text-sm font-extrabold transition " +
          (mode === "polar" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent")
        }
      >
        Polar
      </button>
    </div>
  );
}

/**
 * Creates an SVG arc path for the polar chart segments
 */
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

/**
 * Traditional radar/spider chart visualization
 */
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
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const size = 700;
  const pad = 150;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 280;
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
    <div className="relative">
      <svg
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        viewBox={`${-pad} ${-pad} ${size + pad * 2} ${size + pad * 2}`}
        className="block overflow-visible"
      >
        {/* Grid rings */}
        {Array.from({ length: rings }, (_, i) => {
          const lvl = (i + 1) as Level;
          const r = (maxR * (i + 1)) / rings;
          return (
            <g key={lvl}>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgb(200,200,200)" strokeWidth={1} className="dark:stroke-white/10" />
              <text x={cx + r + 6} y={cy + 4} fontSize={12} fill="rgb(120,120,120)" fontWeight={700} className="dark:fill-white/40">
                {lvl}
              </text>
            </g>
          );
        })}

        {/* Radial axes and labels */}
        {skills.map((s, i) => {
          const a = start + i * angleStep;
          const x2 = cx + maxR * Math.cos(a);
          const y2 = cy + maxR * Math.sin(a);
          const lp = labelPos(i);
          const anchor = Math.abs(Math.cos(lp.a)) < 0.25 ? "middle" : Math.cos(lp.a) > 0 ? "start" : "end";

          return (
            <g key={s.id}>
              <line x1={cx} y1={cy} x2={x2} y2={y2} stroke={isDark ? "rgba(255,255,255,0.1)" : "rgb(200,200,200)"} strokeWidth={1} />
              <text x={lp.x} y={lp.y} textAnchor={anchor} dominantBaseline="middle" fontSize={14} fill={isDark ? "rgba(255,255,255,0.9)" : "rgb(40,40,40)"} fontWeight={700}>
                {s.label}
              </text>
            </g>
          );
        })}

        {/* Data polygon */}
        <polygon points={poly} fill="rgb(96,165,250)" fillOpacity={0.25} stroke="rgb(59,130,246)" strokeWidth={2} className="dark:fill-blue-400/25 dark:stroke-blue-400" />

        {/* Data points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={4} fill="rgb(59,130,246)" stroke="rgb(29,78,216)" className="dark:fill-blue-400 dark:stroke-blue-500" />
        ))}

        {/* Center label */}
        {showCenter ? (
          <g>
            <circle cx={cx} cy={cy} r={44} fill="rgb(40,40,40)" className="dark:fill-slate-700" />
            <text x={cx} y={cy + 6} textAnchor="middle" fontSize={14} fill="rgb(255,255,255)" fontWeight={800} className="dark:fill-white/90">
              {title}
            </text>
          </g>
        ) : null}
      </svg>
    </div>
  );
}

/**
 * Polar (circular/wedge) chart visualization
 */
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
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const size = 700;
  const pad = 150;
  const cx = size / 2;
  const cy = size / 2;
  const innerR = 90;
  const outerR = 280;

  const n = Math.max(1, skills.length);
  const angle = (Math.PI * 2) / n;
  const start = -Math.PI / 2;

  function labelPos(i: number) {
    const a = start + (i + 0.5) * angle;
    const r = outerR + 22;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), a };
  }

  return (
    <div className="relative">
      <svg
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        viewBox={`${-pad} ${-pad} ${size + pad * 2} ${size + pad * 2}`}
        className="block overflow-visible"
      >
        {/* Grid rings */}
        {[1, 2, 3, 4, 5].map((lvl) => {
          const r = innerR + ((outerR - innerR) * lvl) / 5;
          return (
            <g key={lvl}>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgb(200,200,200)" strokeWidth={1} className="dark:stroke-white/10" />
              <text x={cx + r + 6} y={cy + 4} fontSize={12} fill="rgb(120,120,120)" fontWeight={700} className="dark:fill-white/40">
                {lvl}
              </text>
            </g>
          );
        })}

        {/* Radial separator lines */}
        {skills.map((s, i) => {
          const a = start + i * angle;
          const x1 = cx + innerR * Math.cos(a);
          const y1 = cy + innerR * Math.sin(a);
          const x2 = cx + outerR * Math.cos(a);
          const y2 = cy + outerR * Math.sin(a);
          return <line key={`sep-${s.id}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgb(200,200,200)" strokeWidth={1} className="dark:stroke-white/10" />;
        })}

        {/* Background segments - only in light mode */}
        {!isDark && skills.map((s, i) => {
          const a0 = start + i * angle;
          const a1 = a0 + angle;
          const d = arcPath(cx, cy, innerR, outerR, a0, a1);
          return <path key={`bg-${s.id}`} d={d} fill="rgb(240,240,240)" stroke="rgb(200,200,200)" strokeWidth={1} />;
        })}

        {/* Data segments */}
        {skills.map((s, i) => {
          const lvl = selections[s.id] ?? 0;
          const r1 = innerR + ((outerR - innerR) * lvl) / 5;
          const a0 = start + i * angle;
          const a1 = a0 + angle;
          const d = arcPath(cx, cy, innerR, r1, a0, a1);

          return (
            <path key={s.id} d={d} fill="rgb(96,165,250)" fillOpacity={0.25} stroke="rgb(59,130,246)" strokeWidth={1.2} className="dark:fill-blue-400/25 dark:stroke-blue-400">
              <title>
                {s.label}: {lvl ? `${LEVEL_LABELS[lvl as Level]} (${lvl})` : "Not set"}
              </title>
            </path>
          );
        })}

        {/* Labels */}
        {skills.map((s, i) => {
          const lp = labelPos(i);
          const anchor = Math.abs(Math.cos(lp.a)) < 0.25 ? "middle" : Math.cos(lp.a) > 0 ? "start" : "end";
          return (
            <text key={`lbl-${s.id}`} x={lp.x} y={lp.y} textAnchor={anchor} dominantBaseline="middle" fontSize={14} fill={isDark ? "rgba(255,255,255,0.9)" : "rgb(40,40,40)"} fontWeight={700}>
              {s.label}
            </text>
          );
        })}

        {/* Center label */}
        {showCenter ? (
          <g>
            <circle cx={cx} cy={cy} r={48} fill="rgb(40,40,40)" className="dark:fill-slate-700" />
            <text x={cx} y={cy + 6} textAnchor="middle" fontSize={14} fill="rgb(255,255,255)" fontWeight={800} className="dark:fill-white/90">
              {title}
            </text>
          </g>
        ) : null}
      </svg>
    </div>
  );
}

/**
 * Main component that wraps both visualization modes with a toggle
 */
export default function ProficiencyVisualized({
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

  const showCenter = variant === "large";
  const Chart = mode === "radar" ? RadarChart : PolarChart;

  const content = (
    <div className="flex flex-col items-center gap-3">
      <VizToggle mode={mode} setMode={setMode} />
      <div className={variant === "large" ? "w-full max-w-[800px]" : "w-full max-w-[640px]"}>
        <Chart title={title} skills={skills} selections={selections} showCenter={showCenter} />
      </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 text-sm font-semibold">Proficiency Visualized</div>
      {content}
    </div>
  );
}
