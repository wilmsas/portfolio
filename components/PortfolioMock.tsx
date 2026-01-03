"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowUpRight,
    Briefcase,
    FileText,
    Search,
    Shield,
    Sparkles,
    X,
    ChevronRight,
    Copy,
    Check,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { allCaseStudies } from "@/data/case-studies";

/**
 * Portfolio Mock v2 — Non-dashboard, now themed with your Coolors palette:
 *   - #F4F1DE (cream)
 *   - #E07A5F (terra cotta)
 *   - #3D405B (deep slate)
 *   - #81B29A (sage)
 *   - #F2CC8F (sand)
 *
 * Implementation note:
 * - Uses CSS variables + Tailwind arbitrary values so you don't need to extend tailwind.config.
 * - Keeps contrast recruiter-safe; accent colors are used sparingly.
 *
 * Clipboard fix retained: copy can be blocked by Permissions Policy in some embeds.
 */

// Use imported case studies data
const CASES = allCaseStudies;

function useHotkeys(handler: (e: KeyboardEvent) => void) {
    useEffect(() => {
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [handler]);
}

/**
 * Resilient clipboard helper.
 * Returns true if we successfully copied, false otherwise.
 */
async function safeCopyText(text: string): Promise<boolean> {
    // 1) Try modern Clipboard API (can be blocked by Permissions Policy)
    try {
        if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch {
        // fall through
    }

    // 2) Fallback: execCommand('copy') using a temporary textarea
    try {
        if (typeof document === "undefined") return false;
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.top = "0";
        ta.style.left = "0";
        ta.style.opacity = "0";
        ta.style.pointerEvents = "none";
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, ta.value.length);
        const ok = document.execCommand?.("copy") ?? false;
        document.body.removeChild(ta);
        return !!ok;
    } catch {
        return false;
    }
}

function Kbd({ children }: { children: React.ReactNode }) {
    return (
        <kbd className="rounded-md border border-border bg-card px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground shadow-sm">
            {children}
        </kbd>
    );
}

function Tag({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center rounded-full border border-border bg-card/80 px-2.5 py-1 text-[12px] font-medium text-muted-foreground">
            {children}
        </span>
    );
}


function Hairline() {
    return <div className="h-px w-full bg-muted" />;
}

function SubtleGlow() {
    return (
        <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-[color:var(--sand)]/60 to-transparent blur-3xl"
        />
    );
}

function CopyFallbackDialog({
    open,
    text,
    title,
    onClose,
}: {
    open: boolean;
    text: string;
    title: string;
    onClose: () => void;
}) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                inputRef.current?.focus();
                inputRef.current?.select();
            }, 50);
        }
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal>
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="absolute left-1/2 top-24 w-[min(680px,92vw)] -translate-x-1/2 overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
            >
                <div className="flex items-start justify-between gap-3 p-4">
                    <div>
                        <div className="text-sm font-semibold text-foreground">{title}</div>
                        <div className="mt-1 text-[12px] text-muted-foreground">
                            Copy is blocked in this environment. Select the text below and copy manually.
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-accent"
                    >
                        <X className="h-4 w-4" /> Close
                    </button>
                </div>
                <Hairline />
                <div className="p-4">
                    <input
                        ref={inputRef}
                        readOnly
                        value={text}
                        className="w-full rounded-2xl border border-border bg-card/80 px-3 py-3 text-sm text-foreground outline-none"
                    />
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground">
                        <span>Tip:</span>
                        <Kbd>⌘</Kbd>
                        <span>+</span>
                        <Kbd>C</Kbd>
                        <span className="opacity-70">(or Ctrl+C)</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function CommandPalette({
    open,
    onClose,
    onNavigate,
    onCopyEmail,
}: {
    open: boolean;
    onClose: () => void;
    onNavigate: (key: string) => void;
    onCopyEmail: () => Promise<void>;
}) {
    const [q, setQ] = useState("");
    const [copied, setCopied] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const items = useMemo(() => {
        const base = [
            { key: "home", label: "Home", hint: "Navigate" },
            { key: "route:/case-studies", label: "Case Studies", hint: "Navigate" },
            { key: "route:/resume", label: "Resume", hint: "Navigate" },
            { key: "route:/contact", label: "Contact", hint: "Navigate" },
            { key: "copy:email", label: "Email", hint: "Action" },

            ...CASES.map((c) => ({
                key: `case:${c.id}`,
                label: c.title,
                hint: "Open case study",
            })),
        ];

        const term = q.trim().toLowerCase();
        if (!term) return base;
        return base.filter((x) => x.label.toLowerCase().includes(term));
    }, [q]);


    useEffect(() => {
        if (open) {
            setQ("");
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal>
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <motion.div
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="absolute left-1/2 top-24 w-[min(760px,92vw)] -translate-x-1/2 overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
            >
                <div className="flex items-center gap-2 p-4">
                    <div className="rounded-2xl border border-border bg-card/80 p-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                        ref={inputRef}
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search: case studies, resume, contact…"
                        className="w-full rounded-2xl border border-border bg-card px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
                    />
                    <button
                        onClick={onClose}
                        className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-accent"
                    >
                        <X className="h-4 w-4" />
                        Close
                    </button>
                </div>

                <Hairline />

                <div className="max-h-[50vh] overflow-auto p-2">
                    <div className="space-y-1">
                        {items.map((item) => (
                            <button
                                key={item.key}
                                onClick={async () => {
                                    // Copy email stays special
                                    if (item.key === "copy:email") {
                                        await onCopyEmail();
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 1200);
                                        return;
                                    }
                                    // Route commands (real URLs)
                                    if (item.key.startsWith("route:")) {
                                        const path = item.key.replace("route:", "");
                                        if (path === "/resume") onNavigate("resume");
                                        if (path === "/contact") onNavigate("contact");
                                        if (path === "/case-studies") onNavigate("work");

                                        onClose();
                                        return;
                                    }

                                    // Default behavior (existing)
                                    onNavigate(item.key);
                                    onClose();
                                }}

                                className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-transparent px-3 py-2 text-left hover:border-border hover:bg-accent"
                            >
                                <div>
                                    <div className="text-sm font-semibold text-foreground">
                                        {item.label}
                                    </div>
                                    <div className="text-[12px] text-muted-foreground">{item.hint}</div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                            </button>
                        ))}

                        <AnimatePresence>
                            {copied ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 6 }}
                                    className="mx-2 mt-2 rounded-2xl border border-border bg-card/80 p-3 text-sm font-semibold text-foreground"
                                >
                                    <span className="inline-flex items-center gap-2">
                                        <Check className="h-4 w-4" /> Email copied
                                    </span>
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </div>
                </div>

                <Hairline />

                <div className="flex items-center justify-between p-4 text-[12px] text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Kbd>⌘</Kbd>
                        <Kbd>K</Kbd>
                        <span className="opacity-70">to open</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Kbd>Esc</Kbd>
                        <span className="opacity-70">to close</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
function Hero({
    onPrimary,
    onSecondary,
}: {
    onPrimary: () => void;
    onSecondary: () => void;
}) {
    return (
        <section className="relative overflow-hidden rounded-[2.25rem] border border-border bg-card p-6 shadow-sm md:p-10">
            <SubtleGlow />
            <div className="relative">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[12px] font-semibold text-muted-foreground">
                        <Shield className="h-4 w-4 text-foreground" />
                        defense / gov fluent
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-[12px] font-semibold text-muted-foreground">
                        <Sparkles className="h-4 w-4 text-primary" />
                        sharp + exploratory
                    </span>
                </div>

                <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                    I design decision-ready products—
                    <span className="text-muted-foreground"> turning ambiguity into alignment.</span>
                </h1>

                <p className="mt-4 max-w-2xl text-pretty text-base text-foreground/80 md:text-lg">
                    My work is strongest in constrained, high-stakes environments: many stakeholders, unclear ownership, and systems that need
                    to ship without drama.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                        onClick={onPrimary}
                        className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95"
                    >
                        <Briefcase className="h-4 w-4" />
                        View case studies
                        <ArrowUpRight className="h-4 w-4" />
                    </button>
                    <button
                        onClick={onSecondary}
                        className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-accent"
                    >
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        Resume
                        <ArrowUpRight className="h-4 w-4" />
                    </button>
                    <div className="text-[12px] font-semibold text-muted-foreground">
                        Tip: <Kbd>⌘</Kbd> <Kbd>K</Kbd>
                    </div>
                </div>

                <div className="mt-8 grid gap-2 sm:grid-cols-2">
                    {[
                        {
                            t: "Alignment",
                            d: "Translate competing priorities into shared language + decisions.",
                        },
                        {
                            t: "Structure",
                            d: "Turn ambiguity into flows, artifacts, and clear ownership.",
                        },
                        {
                            t: "Execution",
                            d: "Ship the minimum system that changes outcomes.",
                        },
                        {
                            t: "Signal",
                            d: "Outcomes first. Depth on demand. No portfolio theater.",
                        },
                    ].map((x) => (
                        <div
                            key={x.t}
                            className="rounded-2xl border border-border bg-card/80 p-4"
                        >
                            <div className="text-[12px] font-semibold text-foreground">{x.t}</div>
                            <div className="mt-1 text-sm text-muted-foreground">{x.d}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CaseRow({
    c,
    href,
    onOpen,
}: {
    c: (typeof CASES)[number];
    href: string;
    onOpen: () => void;
}) {
    return (
        <Link
            href={href}
            onClick={(e) => {
                // allow cmd/ctrl click + middle click to open in new tab naturally
                if (e.metaKey || e.ctrlKey || e.button === 1) return;

                // update local UI state, but let Link handle navigation
                onOpen();
            }}

            className="group relative block w-full rounded-[1.75rem] p-[1px] text-left transition hover:-translate-y-0.5"
        >
            {/* Animated border ring */}
            <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-gradient-to-r from-primary/60 via-primary to-primary/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />

            {/* Card */}
            <div className="relative rounded-[1.7rem] border border-border bg-card p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-sm font-semibold text-foreground">{c.title}</h3>
                            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                                <Shield className="h-3 w-3 text-primary" />
                                defense-ready
                            </span>
                        </div>
                        <p className="mt-2 text-sm text-foreground/80">{c.outcome}</p>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            {c.tags.slice(0, 4).map((t) => (
                                <Tag key={t}>{t}</Tag>
                            ))}
                        </div>
                    </div>

                    <div className="shrink-0 text-muted-foreground group-hover:text-foreground">
                        <ArrowUpRight className="h-4 w-4" />
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-start text-[12px] text-muted-foreground">
                    <span className="rounded-full border border-border bg-card/80 px-2 py-1">{c.time}</span>
                </div>
            </div>
        </Link>
    );
}

function CaseDetail({
    c,
    onBack,
    onCopy,
}: {
    c: (typeof CASES)[number];
    onBack: () => void;
    onCopy: (text: string, label: string) => Promise<void>;
}) {
    const [copied, setCopied] = useState(false);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                    onClick={onBack}
                    className="rounded-2xl border border-border bg-card px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-accent"
                >
                    ← Back to Case Studies
                </button>

                <div className="flex items-center gap-2">
                    <button
                        onClick={async () => {
                            const url = `${window.location.origin}/case-studies/${c.id}`;
                            await onCopy(url, "Link copied");
                            setCopied(true);
                            setTimeout(() => setCopied(false), 1200);
                        }}
                        className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-accent"
                    >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied" : "Share"}
                    </button>
                </div>
            </div>

            {/* Header Section */}
            <section className="rounded-[2.25rem] border border-border bg-card p-6 shadow-sm md:p-8">
                <div className="flex flex-wrap items-center gap-2">
                    {c.tags.map((t) => (
                        <Tag key={t}>{t}</Tag>
                    ))}
                </div>

                <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                    {c.title}
                </h1>
                <p className="mt-3 text-pretty text-lg text-foreground/90">{c.outcome}</p>

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-border bg-card/80 p-4">
                        <div className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">Timeline</div>
                        <div className="mt-1 text-base font-semibold text-foreground">{c.time}</div>
                    </div>
                    <div className="rounded-2xl border border-border bg-card/80 p-4">
                        <div className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">Focus</div>
                        <div className="mt-1 text-base font-semibold text-foreground">Alignment → execution</div>
                    </div>
                </div>
            </section>

            {/* Executive Summary */}
            {c.fullContent && (
                <section className="rounded-[2.25rem] border border-border bg-card p-6 shadow-sm md:p-8">
                    <h2 className="text-xl font-semibold text-foreground">Executive Summary</h2>
                    <p className="mt-3 text-base leading-relaxed text-foreground/85">
                        {c.fullContent.executiveSummary}
                    </p>
                </section>
            )}

            {/* Problem Statement */}
            {c.fullContent && (
                <section className="rounded-[2.25rem] border border-border bg-card p-6 shadow-sm md:p-8">
                    <h2 className="text-xl font-semibold text-foreground">Problem Statement</h2>
                    <p className="mt-3 text-base leading-relaxed text-foreground/85">
                        {c.fullContent.problemStatement}
                    </p>
                </section>
            )}

            {/* Users & Scope */}
            {c.fullContent?.users && (
                <section className="rounded-[2.25rem] border border-border bg-card p-6 shadow-sm md:p-8">
                    <h2 className="text-xl font-semibold text-foreground">Users & Scope</h2>

                    <div className="mt-4 space-y-4">
                        <div>
                            <h3 className="text-sm font-semibold text-foreground">Primary Users</h3>
                            <ul className="mt-2 space-y-1">
                                {c.fullContent.users.primary.map((user, idx) => (
                                    <li key={idx} className="flex gap-2 text-sm text-foreground/85">
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                        <span>{user}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                            <div className="rounded-2xl border border-border bg-card/80 p-4">
                                <div className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">Scale</div>
                                <div className="mt-1 text-sm text-foreground/85">{c.fullContent.users.scale}</div>
                            </div>
                            {c.fullContent.users.environment && (
                                <div className="rounded-2xl border border-border bg-card/80 p-4">
                                    <div className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">Environment</div>
                                    <div className="mt-1 text-sm text-foreground/85">{c.fullContent.users.environment}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Constraints */}
            {c.fullContent?.constraints && c.fullContent.constraints.length > 0 && (
                <section className="rounded-[2.25rem] border border-border bg-card p-6 shadow-sm md:p-8">
                    <h2 className="text-xl font-semibold text-foreground">Key Constraints</h2>
                    <div className="mt-4 space-y-3">
                        {c.fullContent.constraints.map((constraint, idx) => (
                            <div key={idx} className="rounded-2xl border border-border bg-card/80 p-4">
                                <h3 className="text-sm font-semibold text-foreground">{constraint.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-foreground/85">{constraint.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Design Strategy */}
            {c.fullContent?.designStrategy && (
                <section className="rounded-[2.25rem] border border-border bg-card p-6 shadow-sm md:p-8">
                    <h2 className="text-xl font-semibold text-foreground">Design Strategy</h2>
                    <p className="mt-3 text-base leading-relaxed text-foreground/85">
                        {c.fullContent.designStrategy}
                    </p>
                </section>
            )}

            {/* Solution */}
            {c.fullContent?.solution && (
                <section className="rounded-[2.25rem] border border-border bg-card p-6 shadow-sm md:p-8">
                    <h2 className="text-xl font-semibold text-foreground">{c.fullContent.solution.title}</h2>
                    {c.fullContent.solution.description && (
                        <p className="mt-3 text-base leading-relaxed text-foreground/85">
                            {c.fullContent.solution.description}
                        </p>
                    )}

                    {c.fullContent.solution.steps && (
                        <div className="mt-4">
                            <h3 className="text-sm font-semibold text-foreground">How it worked</h3>
                            <ol className="mt-3 space-y-2">
                                {c.fullContent.solution.steps.map((step, idx) => (
                                    <li key={idx} className="flex gap-3 text-sm text-foreground/85">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                                            {idx + 1}
                                        </span>
                                        <span className="pt-0.5">{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}

                    {c.fullContent.solution.benefits && (
                        <div className="mt-4 rounded-2xl border border-border bg-card/80 p-4">
                            <h3 className="text-sm font-semibold text-foreground">This ensured:</h3>
                            <ul className="mt-2 space-y-1">
                                {c.fullContent.solution.benefits.map((benefit, idx) => (
                                    <li key={idx} className="flex gap-2 text-sm text-foreground/85">
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {c.fullContent.solution.features && (
                        <div className="mt-4">
                            <h3 className="text-sm font-semibold text-foreground">Key Features</h3>
                            <ul className="mt-3 space-y-2">
                                {c.fullContent.solution.features.map((feature, idx) => (
                                    <li key={idx} className="flex gap-2 text-sm text-foreground/85">
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>
            )}

            {/* Additional Capabilities */}
            {c.fullContent?.additionalCapabilities && c.fullContent.additionalCapabilities.length > 0 && (
                <section className="rounded-[2.25rem] border border-border bg-card p-6 shadow-sm md:p-8">
                    <h2 className="text-xl font-semibold text-foreground">Additional Capabilities</h2>
                    <ul className="mt-3 space-y-2">
                        {c.fullContent.additionalCapabilities.map((capability, idx) => (
                            <li key={idx} className="flex gap-2 text-sm text-foreground/85">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                <span>{capability}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Outcome & Impact */}
            <section className="rounded-[2.25rem] border border-border bg-card p-6 shadow-sm md:p-8">
                <h2 className="text-xl font-semibold text-foreground">Outcome & Impact</h2>
                <ul className="mt-4 space-y-2">
                    {c.impact.map((x, idx) => (
                        <li key={idx} className="flex gap-2 text-sm text-foreground/85">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            <span>{x}</span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Reflection */}
            {c.fullContent?.reflection && (
                <section className="rounded-[2.25rem] border border-border bg-card p-6 shadow-sm md:p-8">
                    <h2 className="text-xl font-semibold text-foreground">Reflection</h2>
                    <p className="mt-3 text-base leading-relaxed text-foreground/85">
                        {c.fullContent.reflection}
                    </p>
                </section>
            )}
        </div>
    );
}

export default function PortfolioMock({
    initialRoute,
    initialCaseId,
}: {
    initialRoute?: "home" | "work" | "resume" | "contact";
    initialCaseId?: string;
}) {

    // Replace with your actual email
    const EMAIL = "wilmsas@me.com";

    const router = useRouter();
    const pathname = usePathname();

    const [active, setActive] = useState<string>(() => {
        if (initialRoute) return initialRoute;

        // derive from URL
        if (pathname?.startsWith("/case-studies")) return "work";
        if (pathname === "/resume") return "resume";
        if (pathname === "/contact") return "contact";
        return "home";
    });
    const [caseId, setCaseId] = useState<string | null>(
        initialCaseId ?? null);
    const [cmdOpen, setCmdOpen] = useState(false);


    // Clipboard fallback UI
    const [copyFallbackOpen, setCopyFallbackOpen] = useState(false);
    const [copyFallbackText, setCopyFallbackText] = useState("");
    const [copyFallbackTitle, setCopyFallbackTitle] = useState("Copy");

    const [toast, setToast] = useState<null | { msg: string }>(null);

    useEffect(() => {
        // Case studies: keep active + caseId in sync with URL
        if (pathname?.startsWith("/case-studies")) {
            setActive("work");

            // /case-studies (list)
            if (pathname === "/case-studies") {
                setCaseId(null);
                return;
            }

            // /case-studies/:slug (detail)
            const slug = pathname.replace("/case-studies/", "");
            setCaseId(slug || null);
            return;
        }

        // Resume
        if (pathname === "/resume") {
            setActive("resume");
            setCaseId(null);
            return;
        }

        // Contact
        if (pathname === "/contact") {
            setActive("contact");
            setCaseId(null);
            return;
        }

        // Home
        setActive("home");
        setCaseId(null);
    }, [pathname]);


    useHotkeys((e) => {
        const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
        if (isCmdK) {
            e.preventDefault();
            setCmdOpen(true);
            return;
        }
        if (e.key === "Escape") {
            setCmdOpen(false);
            setCopyFallbackOpen(false);
        }
    });

    const selectedCase = useMemo(
        () => CASES.find((c) => c.id === caseId) || null,
        [caseId]
    );

    const onNavigate = (key: string) => {
        // Case study deep links
        if (key.startsWith("case:")) {
            const id = key.split(":")[1];
            setActive("work");
            setCaseId(id);
            router.push(`/case-studies/${id}`);
            return;
        }

        // Home → /
        if (key === "home") {
            setActive("home");
            setCaseId(null);
            router.push("/");
            return;
        }

        // Case studies list → /case-studies
        if (key === "work") {
            setActive("work");
            setCaseId(null);
            router.push("/case-studies");
            return;
        }

        // Resume / Contact (still view-only for now)
        if (key === "resume") {
            setActive("resume");
            setCaseId(null);
            router.push("/resume");
            return;
        }

        // Contact
        if (key === "contact") {
            setActive("contact");
            setCaseId(null);
            router.push("/contact");
            return;
        }

        setActive(key);
        if (key !== "work") setCaseId(null);
    };

    const onCopy = async (text: string, label: string) => {
        const ok = await safeCopyText(text);
        if (ok) {
            setToast({ msg: `${label}: copied` });
            window.setTimeout(() => setToast(null), 1400);
            return;
        }
        // Clipboard blocked → show manual copy dialog
        setCopyFallbackTitle(label);
        setCopyFallbackText(text);
        setCopyFallbackOpen(true);
    };

    const onCopyEmail = async () => {
        await onCopy(EMAIL, "Email");
    };

    // --- Minimal “tests” (runtime sanity checks) ---
    // These are safe to keep in; they only run in dev.
    useEffect(() => {
        if (typeof process !== "undefined" && process.env?.NODE_ENV === "production") return;
        safeCopyText("test").then((v) => {
            // eslint-disable-next-line no-console
            console.assert(typeof v === "boolean", "safeCopyText should resolve to boolean");
        });
        // eslint-disable-next-line no-console
        console.assert(typeof safeCopyText === "function", "safeCopyText should be a function");
    }, []);

    return (
        <div
            className="min-h-screen bg-background text-foreground"
        >
            <AnimatePresence>
                {cmdOpen ? (
                    <CommandPalette
                        open={cmdOpen}
                        onClose={() => setCmdOpen(false)}
                        onNavigate={onNavigate}
                        onCopyEmail={onCopyEmail}
                    />
                ) : null}
            </AnimatePresence>

            <AnimatePresence>
                {copyFallbackOpen ? (
                    <CopyFallbackDialog
                        open={copyFallbackOpen}
                        text={copyFallbackText}
                        title={copyFallbackTitle}
                        onClose={() => setCopyFallbackOpen(false)}
                    />
                ) : null}
            </AnimatePresence>

            <main className="mx-auto max-w-5xl px-4 py-8 md:py-12">
                <AnimatePresence mode="wait">
                    {active === "home" ? (
                        <motion.div
                            key="home"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            transition={{ duration: 0.18 }}
                            className="space-y-6"
                        >
                            <Hero
                                onPrimary={() => onNavigate("work")}
                                onSecondary={() => onNavigate("resume")}
                            />

                            <section className="rounded-[2.25rem] border border-border bg-card p-6 shadow-sm md:p-8">
                                <div className="flex items-center justify-between gap-3">
                                    <h2 className="text-lg font-semibold text-foreground">Featured case studies</h2>
                                    <button
                                        onClick={() => onNavigate("work")}
                                        className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent"
                                    >
                                        View all
                                        <ArrowUpRight className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="mt-4 grid gap-3 md:grid-cols-2">
                                    {CASES.slice(0, 2).map((c) => (
                                        <CaseRow
                                            key={c.id}
                                            c={c}
                                            href={`/case-studies/${c.id}`}
                                            onOpen={() => {
                                                setActive("work");
                                                setCaseId(c.id);
                                            }}
                                        />
                                    ))}
                                </div>
                            </section>
                        </motion.div>
                    ) : null}

                    {active === "work" ? (
                        <motion.div
                            key="work"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            transition={{ duration: 0.18 }}
                            className="space-y-6"
                        >
                            {!selectedCase ? (
                                <section className="rounded-[2.25rem] border border-border bg-card p-6 shadow-sm md:p-8">
                                    <div className="flex flex-wrap items-end justify-between gap-3">
                                        <div>
                                            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Case Studies</h2>
                                            <p className="mt-2 max-w-2xl text-base text-muted-foreground">
                                                Defense and government work focused on high-stakes alignment, secure systems, and mission-critical delivery.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-3">
                                        {CASES.map((c) => (
                                            <CaseRow
                                                key={c.id}
                                                c={c}
                                                href={`/case-studies/${c.id}`}
                                                onOpen={() => {
                                                    setActive("work");
                                                    setCaseId(c.id);
                                                }} />
                                        ))}
                                    </div>
                                </section>
                            ) : (
                                <CaseDetail
                                    c={selectedCase}
                                    onBack={() => {
                                        setCaseId(null);
                                        router.push("/case-studies");
                                    }}
                                    onCopy={onCopy}
                                />
                            )}
                        </motion.div>
                    ) : null}

                    {active === "resume" ? (
                        <motion.div
                            key="resume"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            transition={{ duration: 0.18 }}
                            className="space-y-6"
                        >
                            <section className="rounded-[2.25rem] border border-border bg-card p-6 shadow-sm md:p-8">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Resume</h2>
                                        <p className="mt-2 text-sm text-muted-foreground">Redesign this for better viewability.</p>
                                    </div>
                                    <a
                                        href="/resume.pdf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center rounded-full border border-border bg-card/80 px-4 py-2 text-sm font-semibold text-foreground transition hover:-translate-y-0.5"
                                    >
                                        Download Resume
                                    </a>
                                </div>
                                <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
                                    <div className="flex items-center justify-between border-b border-border px-4 py-3">
                                        <span className="text-sm font-semibold text-foreground">Resume</span>
                                        <a
                                            href="/resume.pdf"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-foreground underline underline-offset-4"
                                        >
                                            Open in new tab
                                        </a>
                                    </div>

                                    <iframe
                                        title="Resume PDF"
                                        src="/resume.pdf"
                                        className="h-[75vh] w-full"
                                    />
                                </div>


                                <div className="mt-6 grid gap-3 md:grid-cols-2">
                                    {[
                                        {
                                            t: "Strategic focus",
                                            d: "Alignment across stakeholders, constrained environments, decision clarity.",
                                        },
                                        {
                                            t: "Defense-ready",
                                            d: "Clearance-forward positioning with mission constraints in mind.",
                                        },
                                    ].map((x) => (
                                        <div key={x.t} className="rounded-2xl border border-border bg-card/80 p-5">
                                            <div className="text-sm font-semibold text-foreground">{x.t}</div>
                                            <div className="mt-2 text-sm text-muted-foreground">{x.d}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 rounded-2xl border border-dashed border-border bg-card p-6">
                                    <div className="text-sm font-semibold text-foreground">Resume content placeholder</div>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Insert Experience / Education / Clearance / Tools. Keep it scannable.
                                    </p>
                                </div>
                            </section>
                        </motion.div>
                    ) : null}

                    {active === "contact" ? (
                        <motion.div
                            key="contact"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            transition={{ duration: 0.18 }}
                            className="space-y-6"
                        >
                            <section className="rounded-[2.25rem] border border-border bg-card p-6 shadow-sm md:p-8">
                                <div>
                                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">Contact</h2>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Feel free to e-mail or connect through LinkedIn
                                    </p>
                                </div>

                                <div className="mt-6 grid gap-3 md:grid-cols-2">
                                    <button
                                        onClick={() => onCopyEmail()}
                                        className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 text-left hover:bg-accent"
                                    >
                                        <div>
                                            <div className="text-sm font-semibold text-foreground">Email</div>
                                            <div className="mt-1 text-sm text-muted-foreground">{EMAIL}</div>
                                        </div>
                                        <Copy className="h-4 w-4 text-muted-foreground" />
                                    </button>

                                    <button
                                        onClick={() => alert("Wire to LinkedIn")}
                                        className="flex items-center justify-between rounded-2xl bg-primary p-5 text-left"
                                    >
                                        <div>
                                            <div className="text-sm font-semibold text-primary-foreground">LinkedIn</div>
                                            <div className="mt-1 text-sm text-primary-foreground/70">Open profile</div>
                                        </div>
                                        <ArrowUpRight className="h-4 w-4 text-primary-foreground" />
                                    </button>
                                </div>
                            </section>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </main>

            {/* Tiny toast */}
            <AnimatePresence>
                {toast ? (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        className="fixed bottom-4 left-1/2 z-40 w-[min(520px,92vw)] -translate-x-1/2 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-lg"
                    >
                        {toast.msg}
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}
