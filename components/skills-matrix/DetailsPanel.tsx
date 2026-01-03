/**
 * DetailsPanel Component
 *
 * Displays detailed information about a selected skill and proficiency level
 * Shows the skill's title, description, and specific bullets for the selected level
 */

import { Skill, Level, LEVEL_LABELS } from "@/data/skills";

interface DetailsPanelProps {
  skill: Skill | null;
  level: Level | null;
}

export function DetailsPanel({ skill, level }: DetailsPanelProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-baseline justify-between gap-6">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Selected Competency</div>
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Level</div>
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto] items-start gap-4 border-t border-border pt-4">
        <div className="min-w-0">
          {skill?.category ? (
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{skill.category}</div>
          ) : null}
          <div className="mt-1 text-lg font-semibold leading-tight">{skill?.label ?? "—"}</div>
        </div>

        <div className="whitespace-nowrap pt-0.5 text-right text-sm font-semibold">
          {level ? `${LEVEL_LABELS[level]} (${level})` : "Not set"}
        </div>
      </div>

      <div className="mt-3">
        {skill && level && skill.levels[level] ? (
          <>
            <div className="text-sm font-semibold">{skill.levels[level].title}</div>
            <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{skill.levels[level].description}</div>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
              {skill.levels[level].bullets.map((b, idx) => (
                <li key={idx}>{b}</li>
              ))}
            </ul>
          </>
        ) : (
          <div className="text-sm leading-relaxed text-muted-foreground">Hover a lane to preview. Click a bar to set a level (1–5).</div>
        )}
      </div>
    </div>
  );
}
