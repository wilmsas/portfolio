/**
 * ComparisonMode Component
 *
 * Shows a comparison between current skill levels and the next level,
 * helping users understand what's needed to progress.
 *
 * Features:
 * - Side-by-side comparison of current vs next level
 * - Highlights skills that are ready for advancement
 * - Shows detailed descriptions of what's required for the next level
 */

"use client";

import type { Skill, Selections, Level } from "@/data/skills/types";
import { LEVEL_LABELS } from "@/data/skills/types";

interface ComparisonModeProps {
  skills: Skill[];
  selections: Selections;
}

export function ComparisonMode({ skills, selections }: ComparisonModeProps) {
  // Filter to only show skills that have a selection (and can potentially level up)
  const skillsWithLevels = skills
    .map((skill) => ({
      skill,
      currentLevel: selections[skill.id] as Level | undefined,
    }))
    .filter((item) => item.currentLevel !== undefined && item.currentLevel < 5)
    .sort((a, b) => {
      // Sort by current level (highest first, so people see their strongest skills)
      if (a.currentLevel !== b.currentLevel) {
        return (b.currentLevel || 0) - (a.currentLevel || 0);
      }
      return a.skill.label.localeCompare(b.skill.label);
    });

  if (skillsWithLevels.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 p-4 text-center">
        <p className="text-xs text-muted-foreground">
          No skills selected yet, or all skills are at Expert level.
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-[500px] space-y-2 overflow-y-auto">
      {skillsWithLevels.map(({ skill, currentLevel }) => {
        const nextLevel = ((currentLevel || 1) + 1) as Level;
        const currentLevelData = skill.levels[currentLevel!];
        const nextLevelData = skill.levels[nextLevel];

        return (
          <div
            key={skill.id}
            className="rounded-lg border border-border bg-card/50 p-3"
          >
            {/* Skill header */}
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-foreground">{skill.label}</h4>
              </div>
              <div className="shrink-0 rounded-full border border-primary/30 bg-accent px-2 py-0.5">
                <span className="text-xs font-medium text-primary">
                  {currentLevel} → {nextLevel}
                </span>
              </div>
            </div>

            {/* Compact comparison */}
            <div className="space-y-2">
              {/* Next level focus */}
              <div className="rounded border border-border bg-muted/40 p-2">
                <div className="mb-1 text-xs font-medium text-foreground">
                  To reach {LEVEL_LABELS[nextLevel]}:
                </div>
                <p className="text-xs text-muted-foreground">
                  {nextLevelData.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
