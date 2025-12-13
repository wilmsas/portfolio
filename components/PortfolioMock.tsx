"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowUpRight,
    Briefcase,
    FileText,
    Home,
    Mail,
    Search,
    Shield,
    Sparkles,
    X,
    ChevronRight,
    Copy,
    Check,
    ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";

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

const NAV = [
    { key: "home", label: "Home", icon: Home },
    { key: "work", label: "Case Studies", icon: Briefcase },
    { key: "resume", label: "Resume", icon: FileText },
    { key: "contact", label: "Contact", icon: Mail },
];

const CASES = [
    {
        id: "il5-marketplace",
        title: "IL5 Marketplace: procurement & approvals",
        outcome: "Reduced intake cycle time via structured workflow + decision gates",
        tags: ["Strategy", "Workflow", "IL5", "Stakeholder alignment"],
        time: "8 weeks",
        complexity: 4,
        impact: [
            "Clarified ownership across contracting / product / vendors",
            "Introduced decision checkpoints + status transparency",
            "Standardized intake artifacts (reduced rework)",
        ],
        preview: {
            problem:
                "Requests were stalling due to unclear ownership, inconsistent artifacts, and hidden status updates.",
            myRole:
                "UX strategy + service design + facilitation (aligned contracting, product, engineers).",
            move:
                "Turned a vague intake into a gated flow with visible status, defined artifacts, and clear handoffs.",
        },
    },
    {
        id: "helpdesk-triage",
        title: "Salesforce Help Desk: requestor experience",
        outcome: "Improved request clarity with guided intake + status page",
        tags: ["UX", "Information architecture", "Forms", "Status UX"],
        time: "3 weeks",
        complexity: 3,
        impact: [
            "Reduced back-and-forth by enforcing category/subcategory logic",
            "Made SLA / age visible (trust + transparency)",
            "Created a requestor-facing journey (not just agent tools)",
        ],
        preview: {
            problem:
                "Agents were triaging well, but requestors had poor visibility and inconsistent descriptions.",
            myRole: "IA + UX flows + interaction model (Lightning design patterns).",
            move:
                "Shifted the experience toward a requestor-first flow: submit → review → status feed.",
        },
    },
    {
        id: "design-system",
        title: "Design system governance: arMUI alignment",
        outcome: "Established adoption path: principles → components → contribution",
        tags: ["Design systems", "Governance", "Enablement"],
        time: "4 weeks",
        complexity: 2,
        impact: [
            "Defined contribution model + review cadence",
            "Aligned product teams on usage standards",
            "Created education artifacts that reduced inconsistency",
        ],
        preview: {
            problem:
                "Teams were building UI variations; the system existed but lacked governance and enablement.",
            myRole: "Strategy + enablement + lightweight governance model.",
            move:
                "Made the system feel like the fastest path: templates, docs, and a clear contribution route.",
        },
    },
];

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

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
        <kbd className="rounded-md border border-[color:var(--border)] bg-[color:var(--card)] px-1.5 py-0.5 text-[11px] font-semibold text-[color:var(--mutedText)] shadow-sm">
            {children}
        </kbd>
    );
}

function Tag({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--pill)] px-2.5 py-1 text-[12px] font-medium text-[color:var(--mutedText)]">
            {children}
        </span>
    );
}

function Complexity({ n }: { n: number }) {
    const dots = Array.from({ length: 5 }, (_, i) => i < n);
    return (
        <div className="flex items-center gap-1" aria-label={`Complexity ${n} of 5`}>
            {dots.map((on, i) => (
                <span
                    key={i}
                    className={cx(
                        "h-1.5 w-3 rounded-full",
                        on ? "bg-[color:var(--ink)]" : "bg-[color:var(--border)]"
                    )}
                />
            ))}
        </div>
    );
}

function Hairline() {
    return <div className="h-px w-full bg-[color:var(--border)]/70" />;
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
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="absolute left-1/2 top-24 w-[min(680px,92vw)] -translate-x-1/2 overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] shadow-2xl"
            >
                <div className="flex items-start justify-between gap-3 p-4">
                    <div>
                        <div className="text-sm font-semibold text-[color:var(--ink)]">{title}</div>
                        <div className="mt-1 text-[12px] text-[color:var(--mutedText)]">
                            Copy is blocked in this environment. Select the text below and copy manually.
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="inline-flex items-center gap-2 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] px-3 py-2 text-sm font-semibold text-[color:var(--mutedText)] hover:bg-[color:var(--pill)]"
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
                        className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--pill)] px-3 py-3 text-sm text-[color:var(--ink)] outline-none"
                    />
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] text-[color:var(--mutedText)]">
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
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            <motion.div
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="absolute left-1/2 top-24 w-[min(760px,92vw)] -translate-x-1/2 overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] shadow-2xl"
            >
                <div className="flex items-center gap-2 p-4">
                    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--pill)] p-2">
                        <Search className="h-4 w-4 text-[color:var(--mutedText)]" />
                    </div>
                    <input
                        ref={inputRef}
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search: case studies, resume, contact…"
                        className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] px-3 py-2 text-sm text-[color:var(--ink)] outline-none placeholder:text-[color:var(--mutedText)]/70 focus:border-[color:var(--sage)]"
                    />
                    <button
                        onClick={onClose}
                        className="inline-flex items-center gap-2 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] px-3 py-2 text-sm font-semibold text-[color:var(--mutedText)] hover:bg-[color:var(--pill)]"
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

                                className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-transparent px-3 py-2 text-left hover:border-[color:var(--border)] hover:bg-[color:var(--pill)]"
                            >
                                <div>
                                    <div className="text-sm font-semibold text-[color:var(--ink)]">
                                        {item.label}
                                    </div>
                                    <div className="text-[12px] text-[color:var(--mutedText)]">{item.hint}</div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-[color:var(--mutedText)] group-hover:text-[color:var(--ink)]" />
                            </button>
                        ))}

                        <AnimatePresence>
                            {copied ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 6 }}
                                    className="mx-2 mt-2 rounded-2xl border border-[color:var(--border)] bg-[color:var(--pill)] p-3 text-sm font-semibold text-[color:var(--ink)]"
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

                <div className="flex items-center justify-between p-4 text-[12px] text-[color:var(--mutedText)]">
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

function TopNav({
    active,
    onNavigate,
    onOpenSearch,
}: {
    active: string;
    onNavigate: (key: string) => void;
    onOpenSearch: () => void;
}) {
    return (
        <div className="sticky top-0 z-40 border-b border-[color:var(--border)]/70 bg-[color:var(--bg)]/80 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
                <button
                    onClick={() => onNavigate("home")}
                    className="group inline-flex items-center gap-2"
                >
                    <span className="grid h-9 w-9 place-items-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] shadow-sm group-hover:bg-[color:var(--pill)]">
                        <Shield className="h-5 w-5 text-[color:var(--ink)]" />
                    </span>
                    <div className="text-left">
                        <div className="text-sm font-semibold text-[color:var(--ink)]">Aleks</div>
                        <div className="text-[12px] text-[color:var(--mutedText)]">Product Designer • TS-SCI</div>
                    </div>
                </button>

                <div className="hidden items-center gap-1 md:flex">
                    {NAV.map((n) => {
                        const isOn = active === n.key;
                        return (
                            <button
                                key={n.key}
                                onClick={() => onNavigate(n.key)}
                                className={cx(
                                    "rounded-2xl px-3 py-2 text-sm font-semibold transition",
                                    isOn
                                        ? "bg-[color:var(--ink)] text-[color:var(--bg)]"
                                        : "text-[color:var(--ink)] hover:bg-[color:var(--card)]"
                                )}
                            >
                                {n.label}
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={onOpenSearch}
                    className="inline-flex items-center gap-2 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] px-3 py-2 text-sm font-semibold text-[color:var(--ink)] shadow-sm hover:bg-[color:var(--pill)]"
                >
                    <Search className="h-4 w-4 text-[color:var(--mutedText)]" />
                    <span className="hidden sm:inline">Search</span>
                    <span className="ml-1 hidden items-center gap-1 text-[12px] text-[color:var(--mutedText)] sm:flex">
                        <Kbd>⌘</Kbd>
                        <Kbd>K</Kbd>
                    </span>
                </button>
            </div>

            {/* Mobile nav (minimal) */}
            <div className="mx-auto max-w-5xl px-4 pb-3 md:hidden">
                <div className="grid grid-cols-4 gap-2">
                    {NAV.map((n) => {
                        const Icon = n.icon;
                        const isOn = active === n.key;
                        return (
                            <button
                                key={n.key}
                                onClick={() => onNavigate(n.key)}
                                className={cx(
                                    "flex items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold",
                                    isOn
                                        ? "border-[color:var(--ink)] bg-[color:var(--ink)] text-[color:var(--bg)]"
                                        : "border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--ink)]"
                                )}
                            >
                                <Icon className={cx("h-4 w-4", isOn ? "text-[color:var(--bg)]" : "text-[color:var(--mutedText)]")} />
                            </button>
                        );
                    })}
                </div>
            </div>
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
        <section className="relative overflow-hidden rounded-[2.25rem] border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-sm md:p-10">
            <SubtleGlow />
            <div className="relative">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--card)] px-3 py-1 text-[12px] font-semibold text-[color:var(--mutedText)]">
                        <Shield className="h-4 w-4 text-[color:var(--ink)]" />
                        defense / gov fluent
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--pill)] px-3 py-1 text-[12px] font-semibold text-[color:var(--mutedText)]">
                        <Sparkles className="h-4 w-4 text-[color:var(--sage)]" />
                        sharp + exploratory
                    </span>
                </div>

                <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-[color:var(--ink)] md:text-5xl">
                    I design decision-ready products—
                    <span className="text-[color:var(--mutedText)]"> turning ambiguity into alignment.</span>
                </h1>

                <p className="mt-4 max-w-2xl text-pretty text-base text-[color:var(--ink)]/80 md:text-lg">
                    My work is strongest in constrained, high-stakes environments: many stakeholders, unclear ownership, and systems that need
                    to ship without drama.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                        onClick={onPrimary}
                        className="inline-flex items-center gap-2 rounded-2xl bg-[color:var(--ink)] px-4 py-2.5 text-sm font-semibold text-[color:var(--bg)] shadow-sm hover:opacity-95"
                    >
                        <Briefcase className="h-4 w-4" />
                        View case studies
                        <ArrowUpRight className="h-4 w-4" />
                    </button>
                    <button
                        onClick={onSecondary}
                        className="inline-flex items-center gap-2 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] px-4 py-2.5 text-sm font-semibold text-[color:var(--ink)] hover:bg-[color:var(--pill)]"
                    >
                        <FileText className="h-4 w-4 text-[color:var(--mutedText)]" />
                        Resume
                        <ArrowUpRight className="h-4 w-4" />
                    </button>
                    <div className="text-[12px] font-semibold text-[color:var(--mutedText)]">
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
                            className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--pill)] p-4"
                        >
                            <div className="text-[12px] font-semibold text-[color:var(--ink)]">{x.t}</div>
                            <div className="mt-1 text-sm text-[color:var(--mutedText)]">{x.d}</div>
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
                className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-[conic-gradient(from_0deg,var(--terra),var(--sage),var(--sand),var(--terra))] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />

            {/* Card */}
            <div className="relative rounded-[1.7rem] border border-[color:var(--border)] bg-[color:var(--card)] p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-sm font-semibold text-[color:var(--ink)]">{c.title}</h3>
                            <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--card)] px-2 py-1 text-[11px] font-semibold text-[color:var(--mutedText)]">
                                <Shield className="h-3 w-3 text-[color:var(--sage)]" />
                                defense-ready
                            </span>
                        </div>
                        <p className="mt-2 text-sm text-[color:var(--ink)]/80">{c.outcome}</p>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            {c.tags.slice(0, 4).map((t) => (
                                <Tag key={t}>{t}</Tag>
                            ))}
                        </div>
                    </div>

                    <div className="shrink-0 text-[color:var(--mutedText)] group-hover:text-[color:var(--ink)]">
                        <ArrowUpRight className="h-4 w-4" />
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-[12px] text-[color:var(--mutedText)]">
                    <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--pill)] px-2 py-1">{c.time}</span>
                    <span className="flex items-center gap-2">
                        <span className="opacity-70">Complexity</span>
                        <Complexity n={c.complexity} />
                    </span>
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
    const [section, setSection] = useState<"framing" | "signals" | "depth">("framing");
    const [copied, setCopied] = useState(false);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                    onClick={onBack}
                    className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] px-3 py-2 text-sm font-semibold text-[color:var(--mutedText)] hover:bg-[color:var(--pill)]"
                >
                    ← Back
                </button>

                <div className="flex items-center gap-2">
                    <button
                        onClick={async () => {
                            const url = `${window.location.origin}${window.location.pathname}#${c.id}`;
                            await onCopy(url, "Copy link");
                            setCopied(true);
                            setTimeout(() => setCopied(false), 1200);
                        }}
                        className="inline-flex items-center gap-2 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] px-3 py-2 text-sm font-semibold text-[color:var(--mutedText)] hover:bg-[color:var(--pill)]"
                    >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied" : "Share"}
                    </button>
                    <button
                        onClick={() => alert("Wire this up to a full write-up route / PDF.")}
                        className="inline-flex items-center gap-2 rounded-2xl bg-[color:var(--ink)] px-3 py-2 text-sm font-semibold text-[color:var(--bg)] hover:opacity-95"
                    >
                        <ExternalLink className="h-4 w-4" />
                        Full write-up
                    </button>
                </div>
            </div>

            <section className="rounded-[2.25rem] border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-sm md:p-8">
                <div className="flex flex-wrap items-center gap-2">
                    {c.tags.map((t) => (
                        <Tag key={t}>{t}</Tag>
                    ))}
                </div>

                <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight text-[color:var(--ink)] md:text-3xl">
                    {c.title}
                </h2>
                <p className="mt-2 text-pretty text-base text-[color:var(--ink)]/80">{c.outcome}</p>

                <div className="mt-5 grid gap-2 md:grid-cols-3">
                    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--pill)] p-4">
                        <div className="text-[12px] font-semibold text-[color:var(--ink)]">Timeline</div>
                        <div className="mt-1 text-sm font-semibold text-[color:var(--mutedText)]">{c.time}</div>
                    </div>
                    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--pill)] p-4">
                        <div className="text-[12px] font-semibold text-[color:var(--ink)]">Complexity</div>
                        <div className="mt-2">
                            <Complexity n={c.complexity} />
                        </div>
                    </div>
                    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--pill)] p-4">
                        <div className="text-[12px] font-semibold text-[color:var(--ink)]">Signal</div>
                        <div className="mt-1 text-sm font-semibold text-[color:var(--mutedText)]">Alignment → execution</div>
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                    {(
                        [
                            { k: "framing", t: "Decision framing" },
                            { k: "signals", t: "Impact signals" },
                            { k: "depth", t: "Optional depth" },
                        ] as const
                    ).map((x) => (
                        <button
                            key={x.k}
                            onClick={() => setSection(x.k)}
                            className={cx(
                                "rounded-2xl px-3 py-2 text-sm font-semibold transition",
                                section === x.k
                                    ? "bg-[color:var(--ink)] text-[color:var(--bg)]"
                                    : "border border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--ink)] hover:bg-[color:var(--pill)]"
                            )}
                        >
                            {x.t}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={section}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18 }}
                        className="mt-5 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-5"
                    >
                        {section === "framing" ? (
                            <div className="space-y-3 text-sm text-[color:var(--ink)]/85">
                                <p>
                                    <span className="font-semibold text-[color:var(--ink)]">Why it mattered:</span> {c.preview.problem}
                                </p>
                                <p>
                                    <span className="font-semibold text-[color:var(--ink)]">My role:</span> {c.preview.myRole}
                                </p>
                                <p>
                                    <span className="font-semibold text-[color:var(--ink)]">Strategic move:</span> {c.preview.move}
                                </p>
                            </div>
                        ) : null}

                        {section === "signals" ? (
                            <div>
                                <div className="text-sm font-semibold text-[color:var(--ink)]">Impact signals</div>
                                <ul className="mt-3 space-y-2 text-sm text-[color:var(--ink)]/85">
                                    {c.impact.map((x) => (
                                        <li key={x} className="flex gap-2">
                                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[color:var(--terra)]" />
                                            <span>{x}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}

                        {section === "depth" ? (
                            <div className="space-y-3 text-sm text-[color:var(--ink)]/85">
                                <div className="text-sm font-semibold text-[color:var(--ink)]">Optional depth (progressive disclosure)</div>
                                <div className="grid gap-2 md:grid-cols-3">
                                    {[
                                        { t: "Tradeoffs", d: "What you didn’t do, and why." },
                                        { t: "Artifacts", d: "Flows, templates, dashboards." },
                                        { t: "Lessons", d: "What you’d change next time." },
                                    ].map((x) => (
                                        <div key={x.t} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--pill)] p-4">
                                            <div className="text-[12px] font-semibold text-[color:var(--ink)]">{x.t}</div>
                                            <div className="mt-1 text-sm text-[color:var(--mutedText)]">{x.d}</div>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-sm text-[color:var(--mutedText)]">
                                    This keeps the page calm for recruiters but gives product/design leadership a place to go deeper.
                                </p>
                            </div>
                        ) : null}
                    </motion.div>
                </AnimatePresence>
            </section>
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
            className="min-h-screen bg-[color:var(--bg)] text-[color:var(--ink)]"
            style={
                {
                    // Theme tokens
                    // bg: cream, ink: deep slate, accents: sage + terra + sand
                    "--bg": "#F4F1DE",
                    "--card": "#FFFFFF",
                    "--pill": "#FFFFFFCC", // translucent card to keep things airy
                    "--ink": "#3D405B",
                    "--mutedText": "#5B5F7A",
                    "--border": "#3D405B1F",
                    "--terra": "#E07A5F",
                    "--sage": "#81B29A",
                    "--sand": "#F2CC8F",
                } as React.CSSProperties
            }
        >
            <TopNav
                active={active}
                onNavigate={onNavigate}
                onOpenSearch={() => setCmdOpen(true)}
            />

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

                            <section className="rounded-[2.25rem] border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-sm md:p-8">
                                <div className="flex items-center justify-between gap-3">
                                    <h2 className="text-lg font-semibold text-[color:var(--ink)]">Featured case studies</h2>
                                    <button
                                        onClick={() => onNavigate("work")}
                                        className="inline-flex items-center gap-2 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] px-3 py-2 text-sm font-semibold text-[color:var(--ink)] hover:bg-[color:var(--pill)]"
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
                                <section className="rounded-[2.25rem] border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-sm md:p-8">
                                    <div className="flex flex-wrap items-end justify-between gap-3">
                                        <div>
                                            <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--ink)]">Case Studies</h2>
                                            <p className="mt-2 text-sm text-[color:var(--mutedText)]">
                                                Outcome-first summaries. Depth is available, but never required.
                                            </p>
                                        </div>
                                        <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--pill)] px-3 py-1 text-[12px] font-semibold text-[color:var(--mutedText)]">
                                            <Sparkles className="h-4 w-4 text-[color:var(--terra)]" />
                                            calm layout
                                        </span>
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
                            <section className="rounded-[2.25rem] border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-sm md:p-8">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--ink)]">Resume</h2>
                                        <p className="mt-2 text-sm text-[color:var(--mutedText)]">Keep this ruthless. Fast scan first, details second.</p>
                                    </div>
                                    <a
                                        href="/resume.pdf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--pill)] px-4 py-2 text-sm font-semibold text-[color:var(--ink)] transition hover:-translate-y-0.5"
                                    >
                                        Download Resume
                                    </a>
                                </div>
                                <div className="mt-6 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)]">
                                    <div className="flex items-center justify-between border-b border-[color:var(--border)] px-4 py-3">
                                        <span className="text-sm font-semibold text-[color:var(--ink)]">Resume</span>
                                        <a
                                            href="/resume.pdf"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium underline underline-offset-4"
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
                                        <div key={x.t} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--pill)] p-5">
                                            <div className="text-sm font-semibold text-[color:var(--ink)]">{x.t}</div>
                                            <div className="mt-2 text-sm text-[color:var(--mutedText)]">{x.d}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--card)] p-6">
                                    <div className="text-sm font-semibold text-[color:var(--ink)]">Resume content placeholder</div>
                                    <p className="mt-2 text-sm text-[color:var(--mutedText)]">
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
                            <section className="rounded-[2.25rem] border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-sm md:p-8">
                                <div>
                                    <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--ink)]">Contact</h2>
                                    <p className="mt-2 text-sm text-[color:var(--mutedText)]">
                                        I respond fastest when the ask is specific: role, mission, constraints.
                                    </p>
                                </div>

                                <div className="mt-6 grid gap-3 md:grid-cols-2">
                                    <button
                                        onClick={() => onCopyEmail()}
                                        className="flex items-center justify-between rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-5 text-left hover:bg-[color:var(--pill)]"
                                    >
                                        <div>
                                            <div className="text-sm font-semibold text-[color:var(--ink)]">Email</div>
                                            <div className="mt-1 text-sm text-[color:var(--mutedText)]">{EMAIL}</div>
                                        </div>
                                        <Copy className="h-4 w-4 text-[color:var(--mutedText)]" />
                                    </button>

                                    <button
                                        onClick={() => alert("Wire to LinkedIn")}
                                        className="flex items-center justify-between rounded-2xl bg-[color:var(--ink)] p-5 text-left"
                                    >
                                        <div>
                                            <div className="text-sm font-semibold text-[color:var(--bg)]">LinkedIn</div>
                                            <div className="mt-1 text-sm text-[color:var(--bg)]/70">Open profile</div>
                                        </div>
                                        <ArrowUpRight className="h-4 w-4 text-[color:var(--bg)]" />
                                    </button>
                                </div>

                                <div className="mt-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--pill)] p-5 text-sm text-[color:var(--mutedText)]">
                                    Optional: add a 3-field intake (role • product • constraint). If it’s longer than that, people won’t use it.
                                </div>
                            </section>
                        </motion.div>
                    ) : null}
                </AnimatePresence>

                <footer className="mt-10 flex flex-wrap items-center justify-between gap-2 text-[12px] text-[color:var(--mutedText)]">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--pill)] px-3 py-1 font-semibold text-[color:var(--mutedText)]">
                            <Sparkles className="h-3 w-3 text-[color:var(--sage)]" /> subtle motion
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--pill)] px-3 py-1 font-semibold text-[color:var(--mutedText)]">
                            recruiter-safe
                        </span>
                    </div>
                    <div className="inline-flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[color:var(--terra)]" />
                        <span className="h-2 w-2 rounded-full bg-[color:var(--sage)]" />
                        <span className="h-2 w-2 rounded-full bg-[color:var(--sand)]" />
                    </div>
                </footer>
            </main>

            {/* Tiny toast */}
            <AnimatePresence>
                {toast ? (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        className="fixed bottom-4 left-1/2 z-40 w-[min(520px,92vw)] -translate-x-1/2 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] px-4 py-3 text-sm font-semibold text-[color:var(--ink)] shadow-lg"
                    >
                        {toast.msg}
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}
