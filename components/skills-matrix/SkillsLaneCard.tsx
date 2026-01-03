/**
 * SkillsLaneCard Component
 *
 * This is the main lane-based editing interface for the Design Skills Matrix.
 * It provides an interactive way to set proficiency levels for multiple skills.
 *
 * Features:
 * - Lane-based editing: Each skill has a horizontal "lane" with a 5-level track
 * - Hover preview: See the level you're about to select before clicking
 * - Details panel: Shows information about the currently selected skill
 * - Visualization mode: Toggle to see a full chart view of all selections
 * - LocalStorage persistence: Automatically saves selections
 * - Coverage tracking: Shows how many skills have been rated
 *
 * The component uses a sophisticated interaction model:
 * - Hover over any lane to preview and see details
 * - Click on the track to set the proficiency level
 * - Smooth scrolling to keep active lane in view
 */

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Level, Skill, Selections } from "@/data/skills/types";
import { LEVELS, LEVEL_LABELS } from "@/data/skills/types";
import { CardShell, Chip } from "./ui";
import { DetailsPanel } from "./DetailsPanel";
import ProficiencyVisualized from "./ProficiencyVisualized";
import { ComparisonMode } from "./ComparisonMode";
import { LearningResources } from "./LearningResources";
import { clamp } from "./utils";

export function SkillsLaneCard({
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
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null);
  const [isTouching, setIsTouching] = useState(false);

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

  // Keyboard navigation
  useEffect(() => {
    if (viewMode !== "edit") return;

    function handleKeyDown(e: KeyboardEvent) {
      const currentIndex = skills.findIndex((s) => s.id === activeSkillId);
      if (currentIndex === -1) return;

      let handled = false;

      // Left/Right arrow keys: navigate between skills
      if (e.key === "ArrowLeft" && currentIndex > 0) {
        const prevSkill = skills[currentIndex - 1];
        setActiveSkillId(prevSkill.id);
        focusLane(prevSkill.id);
        handled = true;
      } else if (e.key === "ArrowRight" && currentIndex < skills.length - 1) {
        const nextSkill = skills[currentIndex + 1];
        setActiveSkillId(nextSkill.id);
        focusLane(nextSkill.id);
        handled = true;
      }

      // Up/Down arrow keys: adjust level for current skill
      const currentLevel = selections[activeSkillId];
      if (e.key === "ArrowUp" && currentLevel && currentLevel < 5) {
        setLevel(activeSkillId, (currentLevel + 1) as Level);
        handled = true;
      } else if (e.key === "ArrowDown" && currentLevel && currentLevel > 1) {
        setLevel(activeSkillId, (currentLevel - 1) as Level);
        handled = true;
      }

      // Number keys 1-5: set level directly
      if (e.key >= "1" && e.key <= "5") {
        const level = parseInt(e.key) as Level;
        setLevel(activeSkillId, level);
        handled = true;
      }

      // Delete/Backspace: clear current skill level
      if ((e.key === "Delete" || e.key === "Backspace") && selections[activeSkillId]) {
        setSelections((prev) => {
          const next = { ...prev };
          delete next[activeSkillId];
          return next;
        });
        handled = true;
      }

      if (handled) {
        e.preventDefault();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, skills, activeSkillId, selections, setSelections, setLevel, focusLane]);

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

  // Touch swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY, time: Date.now() });
    setIsTouching(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const deltaTime = Date.now() - touchStart.time;

    // Detect horizontal swipe (deltaX larger than deltaY and quick enough)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50 && deltaTime < 300) {
      const currentIndex = skills.findIndex((s) => s.id === activeSkillId);

      if (deltaX > 0 && currentIndex > 0) {
        // Swipe right - go to previous skill
        const prevSkill = skills[currentIndex - 1];
        setActiveSkillId(prevSkill.id);
        focusLane(prevSkill.id);
      } else if (deltaX < 0 && currentIndex < skills.length - 1) {
        // Swipe left - go to next skill
        const nextSkill = skills[currentIndex + 1];
        setActiveSkillId(nextSkill.id);
        focusLane(nextSkill.id);
      }
    }

    setTouchStart(null);
    setIsTouching(false);
  };

  const detailsLevel: Level | null = (selectedLevel ?? (hoverPreview && hoverPreview.skillId === activeSkillId ? hoverPreview.level : null)) as Level | null;

  // Clear all selections for this track
  const clearTrackSelections = () => {
    setSelections({});
    try {
      localStorage.removeItem(storageKey);
    } catch {}
  };

  return (
    <CardShell
      title={title}
      subtitle={subtitle}
      right={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === "edit" ? "visualize" : "edit")}
            className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium shadow-sm transition hover:bg-accent"
          >
            {viewMode === "edit" ? "Visualize" : "Back"}
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm(`Clear all selections for ${title}? This cannot be undone.`)) {
                clearTrackSelections();
              }
            }}
            className="rounded-full border border-destructive/30 bg-background px-3 py-1 text-xs font-medium text-destructive shadow-sm transition hover:bg-destructive/10"
            title={`Clear all selections for ${title}`}
          >
            Clear All
          </button>
          <Chip>
            Coverage: <span className="font-medium">{coverage.filled}</span>/{coverage.total}
          </Chip>
        </div>
      }
    >
      {viewMode === "visualize" ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Charts</div>
            <div className="mt-3">
              <ProficiencyVisualized title={vizTitle} skills={skills} selections={selections} embedded variant="large" />
            </div>
            <div className="mt-3 text-xs text-muted-foreground">Manager view: quick glance of strengths and gaps. Select Back to edit levels.</div>
          </div>
        </div>
      ) : (
        <>

          {/* Lanes */}
          <div
            className="mt-4 rounded-2xl border border-border bg-card p-4"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div>
              <div
                className="grid gap-2"
                ref={scrollerRef}
                style={{
                  gridTemplateColumns: `repeat(${Math.ceil(skills.length / 2)}, minmax(150px, 1fr))`,
                  gridTemplateRows: 'auto auto'
                }}
              >
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
                          (isActive ? "bg-accent/40 ring-1 ring-accent" : "hover:bg-black/[0.03] dark:hover:bg-white/5")
                        }
                        onMouseEnter={() => {
                          setActiveSkillId(skill.id);
                          setHoverPreview(null);
                        }}
                        onMouseLeave={() => setHoverPreview(null)}
                        onClick={() => focusLane(skill.id)}
                      >
                        <div className="min-h-[2rem] overflow-hidden text-sm font-semibold leading-tight break-words text-foreground">{skill.label}</div>

                        {/* Track */}
                        <div
                          className="relative h-11 touch-none rounded-xl border border-border bg-muted/50 md:h-11"
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
                          onTouchEnd={(e) => {
                            e.stopPropagation(); // Prevent swipe navigation
                            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                            const touch = e.changedTouches[0];
                            const x = touch.clientX - rect.left;
                            const pct = clamp(x / rect.width, 0, 1);
                            const raw = Math.round(pct * 4) + 1;
                            const lvl = clamp(raw, 1, 5) as Level;
                            setLevel(skill.id, lvl);
                          }}
                          title="Tap to set level (Learner → Expert)"
                        >
                          {/* segments */}
                          <div className="absolute inset-0 grid grid-cols-5 overflow-hidden rounded-xl">
                            {LEVELS.map((lvl) => (
                              <div
                                key={lvl}
                                className={"border-r border-border last:border-r-0 " + (lvl % 2 === 0 ? "bg-accent/15" : "bg-muted/30")}
                              />
                            ))}
                          </div>

                          {/* hover marker */}
                          {isActive && hoverPreview && hoverPreview.skillId === skill.id && (
                            <div
                              className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-primary/70 bg-primary/40"
                              style={{ left: `calc(${((hoverPreview.level - 1) / 4) * 100}% - 8px)` }}
                            />
                          )}

                          {/* selected marker */}
                          {selected && (
                            <div
                              className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-primary bg-primary/60 shadow-sm transition-transform group-hover:scale-[1.03]"
                              style={{ left: `calc(${((selected - 1) / 4) * 100}% - 8px)` }}
                            />
                          )}
                        </div>

                        <div className="mt-1 text-xs text-muted-foreground">
                          {selected ? (
                            <span>
                              <span className="font-semibold">{LEVEL_LABELS[selected]}</span>{" "}
                              <span className="opacity-70">({selected})</span>
                            </span>
                          ) : (
                            <span className="opacity-60">Not set</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>

            <div className="mt-4 text-xs text-muted-foreground">
              <span className="font-medium">Keyboard shortcuts:</span> ← → navigate skills • ↑ ↓ adjust level • 1-5 set level • Delete clear
            </div>
          </div>

          {/* Details, Comparison, and Resources */}
          <div className="mt-4 grid gap-4 lg:grid-cols-3 md:grid-cols-2">
            <DetailsPanel skill={activeSkill} level={detailsLevel} />
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Level Comparison</h3>
                <span className="text-xs text-muted-foreground">Current → Next</span>
              </div>
              <ComparisonMode skills={skills} selections={selections} />
            </div>
            <LearningResources skill={activeSkill} />
          </div>
        </>
      )}
    </CardShell>
  );
}
