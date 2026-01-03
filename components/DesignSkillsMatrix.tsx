"use client";

import { useEffect, useMemo, useState } from "react";
import {
  type Selections,
  baselineSkills,
  specialtySkills,
  specialtyLabels,
  specialtyOptions,
  STORAGE_KEYS,
} from "@/data/skills";
import { Chip, Select } from "./skills-matrix/ui";
import { SkillsLaneCard } from "./skills-matrix/SkillsLaneCard";
import { safeJsonParse, normalizeSelections } from "./skills-matrix/utils";

/**
 * Design Skills Matrix - Main Component
 *
 * A comprehensive proficiency tracking system for design competencies.
 * Features:
 * - 5-level proficiency scale (Learner → Expert)
 * - Baseline design skills + specialty-specific skills
 * - Lane-based editing interface
 * - Radar/polar chart visualizations
 * - LocalStorage persistence
 *
 * Refactored from a 1,893-line monolithic component for better maintainability.
 */
export default function DesignSkillsMatrix() {
  const [domain, setDomain] = useState("product-design");
  const [specialty, setSpecialty] = useState<
    "strategist" | "ui-designer" | "ux-architect" | "visual-designer" | "none"
  >("strategist");

  // Skill selections state
  const [baselineSelections, setBaselineSelections] = useState<Selections>({});
  const [strategistSelections, setStrategistSelections] = useState<Selections>({});
  const [uiDesignerSelections, setUiDesignerSelections] = useState<Selections>({});
  const [uxArchitectSelections, setUxArchitectSelections] = useState<Selections>({});
  const [visualDesignerSelections, setVisualDesignerSelections] = useState<Selections>({});

  // Load selections from localStorage on mount
  useEffect(() => {
    const baseRaw = safeJsonParse<Selections>(localStorage.getItem(STORAGE_KEYS.baseline));
    setBaselineSelections(normalizeSelections(baseRaw, baselineSkills));

    const strategistRaw = safeJsonParse<Selections>(localStorage.getItem(STORAGE_KEYS.strategist));
    setStrategistSelections(normalizeSelections(strategistRaw, specialtySkills.strategist));

    const uiRaw = safeJsonParse<Selections>(localStorage.getItem(STORAGE_KEYS.uiDesigner));
    setUiDesignerSelections(normalizeSelections(uiRaw, specialtySkills["ui-designer"]));

    const archRaw = safeJsonParse<Selections>(localStorage.getItem(STORAGE_KEYS.uxArchitect));
    setUxArchitectSelections(normalizeSelections(archRaw, specialtySkills["ux-architect"]));

    const visRaw = safeJsonParse<Selections>(localStorage.getItem(STORAGE_KEYS.visualDesigner));
    setVisualDesignerSelections(normalizeSelections(visRaw, specialtySkills["visual-designer"]));
  }, []);

  // Calculate baseline coverage (how many skills have been rated)
  const baselineCoverage = useMemo(() => {
    const total = baselineSkills.length;
    const filled = baselineSkills.reduce((acc, s) => acc + (baselineSelections[s.id] ? 1 : 0), 0);
    return { total, filled };
  }, [baselineSelections]);

  // Calculate specialty coverage
  const specialtyCoverage = useMemo(() => {
    if (specialty === "none") return null;

    const skills = specialtySkills[specialty];
    const selections =
      specialty === "strategist"
        ? strategistSelections
        : specialty === "ui-designer"
          ? uiDesignerSelections
          : specialty === "ux-architect"
            ? uxArchitectSelections
            : visualDesignerSelections;

    const total = skills.length;
    const filled = skills.reduce((acc, s) => acc + (selections[s.id] ? 1 : 0), 0);
    return { total, filled };
  }, [specialty, strategistSelections, uiDesignerSelections, uxArchitectSelections, visualDesignerSelections]);

  // Get current specialty selections and setter
  const getCurrentSpecialtyState = () => {
    if (specialty === "none") return { selections: {}, setSelections: () => {}, storageKey: "" };

    const stateMap = {
      strategist: {
        selections: strategistSelections,
        setSelections: setStrategistSelections,
        storageKey: STORAGE_KEYS.strategist,
      },
      "ui-designer": {
        selections: uiDesignerSelections,
        setSelections: setUiDesignerSelections,
        storageKey: STORAGE_KEYS.uiDesigner,
      },
      "ux-architect": {
        selections: uxArchitectSelections,
        setSelections: setUxArchitectSelections,
        storageKey: STORAGE_KEYS.uxArchitect,
      },
      "visual-designer": {
        selections: visualDesignerSelections,
        setSelections: setVisualDesignerSelections,
        storageKey: STORAGE_KEYS.visualDesigner,
      },
    };

    return stateMap[specialty];
  };

  const specialtyState = getCurrentSpecialtyState();

  return (
    <div className="min-h-screen bg-background px-5 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Design Skills Matrix</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Five-level proficiency per competency (Learner → Expert). Baseline + role depth.
            </p>
          </div>

          {/* Coverage badges */}
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Chip>
              Baseline: <span className="font-medium">{baselineCoverage.filled}</span>/{baselineCoverage.total}
            </Chip>
            {specialty !== "none" && specialtyCoverage && (
              <Chip>
                {specialtyLabels[specialty]}: <span className="font-medium">{specialtyCoverage.filled}</span>/
                {specialtyCoverage.total}
              </Chip>
            )}
          </div>
        </div>

        {/* Domain and Specialty selectors */}
        <div className="mt-6 flex flex-wrap gap-4">
          <Select
            label="Domain"
            value={domain}
            onChange={setDomain}
            options={[{ value: "product-design", label: "Product Design" }]}
          />
          <Select
            label="Specialty"
            value={specialty}
            onChange={(v) => setSpecialty(v as typeof specialty)}
            options={specialtyOptions}
          />
        </div>

        {/* Skills cards */}
        <div className="mt-8 space-y-6">
          {/* Baseline skills */}
          <SkillsLaneCard
            title="Design Competency"
            subtitle="These specific proficiencies illustrate your competency within the Design field"
            skills={baselineSkills}
            selections={baselineSelections}
            setSelections={setBaselineSelections}
            storageKey={STORAGE_KEYS.baseline}
            vizTitle="Baseline"
          />

          {/* Specialty skills */}
          {specialty !== "none" && (
            <SkillsLaneCard
              title={`${specialtyLabels[specialty]} (specialty)`}
              subtitle="Use this area to gauge competence within your specific field"
              skills={specialtySkills[specialty]}
              selections={specialtyState.selections}
              setSelections={specialtyState.setSelections}
              storageKey={specialtyState.storageKey}
              vizTitle={specialtyLabels[specialty]}
            />
          )}
        </div>

        {/* Footer note */}
        <div className="mt-8 text-xs text-muted-foreground">
          Note: This stores selections in <span className="font-medium">localStorage</span>.
        </div>
      </div>
    </div>
  );
}
