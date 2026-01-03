/**
 * LearningResources Component
 *
 * Displays curated learning resources for a specific skill
 * Shows high-quality books, courses, articles, and documentation
 */

"use client";

import type { Skill } from "@/data/skills/types";
import { getResourcesForSkill, type LearningResource, type ResourceType, type ResourceSource } from "@/data/learning-resources";

interface LearningResourcesProps {
  skill: Skill | null;
}

const resourceTypeIcons: Record<ResourceType, string> = {
  book: "📚",
  course: "🎓",
  article: "📄",
  documentation: "📖",
  tool: "🔧",
  framework: "⚙️",
};

const resourceTypeLabels: Record<ResourceType, string> = {
  book: "Book",
  course: "Course",
  article: "Article",
  documentation: "Documentation",
  tool: "Tool",
  framework: "Framework",
};

const sourceColors: Record<ResourceSource, string> = {
  "NN/g": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  IDF: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  Coursera: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  "Pivotal Labs": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  W3C: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  HCD: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  Book: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  Industry: "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300",
};

export function LearningResources({ skill }: LearningResourcesProps) {
  if (!skill) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">Select a skill to view learning resources</p>
      </div>
    );
  }

  const resources = getResourcesForSkill(skill.id);

  if (resources.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-2 text-lg font-semibold">Learning Resources</h3>
        <p className="text-sm text-muted-foreground">
          No curated resources available yet for <span className="font-medium">{skill.label}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Learning Resources</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Curated high-quality resources for <span className="font-medium">{skill.label}</span>
        </p>
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        <div className="space-y-3">
          {resources.map((resource) => (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-border bg-card/50 p-3 transition hover:border-primary/30 hover:bg-accent/30"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-lg">{resourceTypeIcons[resource.type]}</span>
                    <h4 className="font-semibold text-foreground">{resource.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">{resource.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${sourceColors[resource.source]}`}>
                  {resource.source}
                </span>
                <span className="rounded-full border border-border bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {resourceTypeLabels[resource.type]}
                </span>
                {resource.author && (
                  <span className="text-xs text-muted-foreground">by {resource.author}</span>
                )}
                {resource.year && (
                  <span className="text-xs text-muted-foreground">({resource.year})</span>
                )}
              </div>

              {resource.tags && resource.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {resource.tags.map((tag, i) => (
                    <span key={i} className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </a>
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 p-3">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Note:</span> All resources are curated from industry-standard sources including Nielsen Norman Group, Interaction Design Foundation, W3C, Pivotal Labs, and recognized design thought leaders.
          </p>
        </div>
      </div>
    </div>
  );
}
