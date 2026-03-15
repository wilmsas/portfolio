"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import {
    ArrowUpRight,
    ArrowLeft,
    X,
    Copy,
    Check,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { allCaseStudies } from "@/data/case-studies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Container } from "@/components/ui/container";
import { Kbd as KbdUI } from "@/components/ui/kbd";
import { Tag as TagUI } from "@/components/ui/tag";
import { Hairline as HairlineUI } from "@/components/ui/hairline";
import { fadeUp, PAGE_TRANSITION, fadeUpSm, stagger, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

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

const Kbd = KbdUI;
const Tag = TagUI;
const Hairline = HairlineUI;

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

    return (
        <Modal open={open} onClose={onClose}>
            <div className="flex items-start justify-between gap-3 p-4">
                <div>
                    <div className="text-sm font-semibold text-foreground">{title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                        Clipboard access isn&apos;t available. Select the text below and copy it manually.
                    </div>
                </div>
                <Button onClick={onClose} variant="outline" size="sm" className="rounded-2xl">
                    <X className="h-4 w-4" /> Close
                </Button>
            </div>
            <Hairline />
            <div className="p-4">
                <Input ref={inputRef} readOnly value={text} className="rounded-2xl bg-card/80" />
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>Tip:</span>
                    <Kbd>⌘</Kbd>
                    <span>+</span>
                    <Kbd>C</Kbd>
                    <span className="opacity-70">(or Ctrl+C)</span>
                </div>
            </div>
        </Modal>
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
        <Container padding="comfortable">
            <m.div variants={stagger} initial="hidden" animate="visible">
                <m.span
                    variants={staggerItem}
                    className="inline-flex items-center rounded-full border border-terra-muted-border bg-terra-muted px-3 py-1 text-xs font-medium text-terra-muted-text"
                >
                    defense / gov fluent
                </m.span>

                <m.h1
                    variants={staggerItem}
                    className="mt-5 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-5xl"
                >
                    I design decision-ready products—
                    <span className="text-muted-foreground"> turning ambiguity into alignment.</span>
                </m.h1>

                <m.p
                    variants={staggerItem}
                    className="mt-4 max-w-2xl text-pretty text-base text-foreground/80 md:text-lg"
                >
                    My work is strongest in constrained, high-stakes environments: many stakeholders, unclear ownership, and systems that need to ship without drama.
                </m.p>

                <m.div variants={staggerItem} className="mt-6 flex flex-wrap items-center gap-3">
                    <Button onClick={onPrimary} className="rounded-2xl" size="lg">
                        View case studies
                        <ArrowUpRight className="h-4 w-4" />
                    </Button>
                    <Button onClick={onSecondary} variant="outline" className="rounded-2xl" size="lg">
                        Resume
                    </Button>
                </m.div>
            </m.div>
        </Container>
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
            className="group flex h-full w-full flex-col text-left"
        >
            <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-border/60 hover:shadow-card-hover">
                <div className="flex flex-1 items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-foreground">{c.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm text-foreground/80">{c.outcome}</p>

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

                <div className="mt-4 flex items-center justify-start text-xs text-muted-foreground">
                    <span className="rounded-full border border-border bg-card/80 px-2 py-1">{c.time}</span>
                </div>
            </div>
        </Link>
    );
}

/** Render multi-paragraph text split on blank lines. */
function Paras({ text }: { text: string }) {
    return (
        <>
            {text.split("\n\n").filter(Boolean).map((para, i) => (
                <p key={i} className={`${i > 0 ? "mt-4" : "mt-3"} text-base leading-relaxed text-foreground/85`}>
                    {para}
                </p>
            ))}
        </>
    );
}

function CaseImage({
    images,
    imageKey,
    caption,
    variant = "default",
}: {
    images?: Record<string, string>;
    imageKey?: string;
    caption?: string;
    variant?: "default" | "hero";
}) {
    if (!imageKey || !images?.[imageKey]) return null;
    return (
        <figure className={cn("mt-8", variant === "hero" && "-mx-2 md:-mx-6")}>
            <img
                src={images[imageKey]}
                alt={caption || imageKey}
                className={cn(
                    "block rounded-lg",
                    variant === "hero"
                        ? "h-auto w-full ring-1 ring-border/40"
                        : "h-auto w-full max-h-[28rem] max-w-full mx-auto object-contain",
                )}
                loading="lazy"
            />
            {variant !== "hero" && caption && (
                <figcaption className="mt-3 text-center text-sm text-muted-foreground">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <m.section
            className="border-t border-border pt-12 pb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
            <p className="mb-8 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">{label}</p>
            {children}
        </m.section>
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
    const imgs = c.fullContent?.images;
    const hasRichContent = !!c.fullContent?.brief;

    return (
        <div>
            {/* ── Nav bar ── */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <Button onClick={onBack} variant="ghost" className="rounded-2xl text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
                <Button
                    onClick={async () => {
                        const origin = typeof window !== "undefined" ? window.location.origin : "";
                        const url = `${origin}/case-studies/${c.id}`;
                        await onCopy(url, "Link");
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1200);
                    }}
                    variant="ghost"
                    className="rounded-2xl text-muted-foreground hover:text-foreground"
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {copied ? (
                            <m.span key="check" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.12 }}>
                                <Check className="h-4 w-4" />
                            </m.span>
                        ) : (
                            <m.span key="copy" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.12 }}>
                                <Copy className="h-4 w-4" />
                            </m.span>
                        )}
                    </AnimatePresence>
                    {copied ? "Copied" : "Share"}
                </Button>
            </div>

            {hasRichContent ? (
                /* ─────────────────────────────────────────────
                   EDITORIAL layout — rich case studies
                ───────────────────────────────────────────── */
                <article>
                    {/* Hero */}
                    <m.header
                        className="pb-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="mb-5 flex flex-wrap gap-2">
                            {c.tags.map((t) => <Tag key={t}>{t}</Tag>)}
                        </div>
                        <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                            {c.title}
                        </h1>
                        <p className="mt-4 max-w-2xl text-pretty text-lg text-foreground/60">
                            {c.outcome}
                        </p>
                        <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
                            <div>
                                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">Timeline</div>
                                <div className="mt-1 text-sm font-medium text-foreground">{c.time}</div>
                            </div>
                            {c.fullContent?.meta?.role && (
                                <div>
                                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">Role</div>
                                    <div className="mt-1 text-sm font-medium text-foreground">{c.fullContent.meta.role}</div>
                                </div>
                            )}
                            {c.fullContent?.meta?.scale && (
                                <div>
                                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">Scale</div>
                                    <div className="mt-1 text-sm font-medium text-foreground">{c.fullContent.meta.scale}</div>
                                </div>
                            )}
                        </div>
                    </m.header>

                    {/* Brief — flows from hero, no label */}
                    {c.fullContent?.brief && (
                        <m.section
                            className="border-t border-border pt-10 pb-6"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Paras text={c.fullContent.brief} />
                        </m.section>
                    )}

                    {/* The Problem */}
                    {c.fullContent?.problemStatement && (
                        <Section label="The Problem">
                            <Paras text={c.fullContent.problemStatement} />
                        </Section>
                    )}

                    {/* Users & Environment */}
                    {c.fullContent?.users && (
                        <Section label="Users & Environment">
                            <div className="space-y-4">
                                {c.fullContent.users.primary.map((user, idx) => (
                                    <p key={idx} className="text-base leading-relaxed text-foreground/85">{user}</p>
                                ))}
                            </div>
                            {c.fullContent.users.environment && (
                                <p className="mt-6 text-base leading-relaxed text-foreground/60">
                                    {c.fullContent.users.environment}
                                </p>
                            )}
                        </Section>
                    )}

                    {/* Discovery & Research */}
                    {c.fullContent?.discovery && (
                        <Section label="Discovery & Research">
                            <Paras text={c.fullContent.discovery.description} />
                            <blockquote className="mt-10 border-l-2 border-primary pl-6">
                                <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-primary/60">Key Insight</p>
                                <p className="text-xl font-medium leading-relaxed text-foreground">
                                    {c.fullContent.discovery.keyInsight}
                                </p>
                            </blockquote>
                        </Section>
                    )}

                    {/* The Design Constraint */}
                    {c.fullContent?.criticalConstraint && (
                        <Section label="The Constraint That Shaped Everything">
                            <Paras text={c.fullContent.criticalConstraint.description} />
                            <blockquote className="mt-10 border-l-2 border-border pl-6">
                                <p className="text-xl font-medium leading-relaxed text-foreground">
                                    {c.fullContent.criticalConstraint.tension}
                                </p>
                            </blockquote>
                        </Section>
                    )}

                    {/* Counseling Flow — images are the star */}
                    {c.fullContent?.counselingFlow && (
                        <Section label="Counseling Flow">
                            {c.fullContent.counselingFlow.intro && (
                                <p className="mb-10 text-base leading-relaxed text-foreground/85">
                                    {c.fullContent.counselingFlow.intro}
                                </p>
                            )}
                            {c.fullContent.counselingFlow.phases.map((phase, idx) => (
                                <m.div
                                    key={idx}
                                    className={idx > 0 ? "mt-14" : ""}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-60px" }}
                                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <p className="text-base leading-relaxed text-foreground/85">{phase.description}</p>
                                    <CaseImage images={imgs} imageKey={phase.imageKey} caption={phase.caption} variant="hero" />
                                </m.div>
                            ))}
                        </Section>
                    )}

                    {/* QR Handshake — visual peak with tinted background */}
                    {c.fullContent?.qrHandshake && (
                        <m.section
                            className="-mx-4 mt-2 rounded-2xl border border-primary/[0.08] bg-primary/[0.03] px-4 pb-10 pt-10 md:-mx-8 md:px-8"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <p className="mb-8 font-mono text-[10px] uppercase tracking-widest text-primary/50">The QR Handshake</p>
                            {c.fullContent.qrHandshake.description && (
                                <Paras text={c.fullContent.qrHandshake.description} />
                            )}
                            {/* Vertical timeline with connected dots */}
                            <div className="relative mt-8">
                                {c.fullContent.qrHandshake.steps.map((step, idx) => (
                                    <div key={idx} className="relative flex gap-5 pb-8 last:pb-0">
                                        {idx < c.fullContent!.qrHandshake!.steps.length - 1 && (
                                            <div className="absolute left-[13px] top-7 h-full w-px bg-primary/20" />
                                        )}
                                        <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-mono text-[11px] tabular-nums text-primary">
                                            {idx + 1}
                                        </div>
                                        <p className="pt-0.5 text-base leading-relaxed text-foreground/85">{step}</p>
                                    </div>
                                ))}
                            </div>
                            <CaseImage images={imgs} imageKey={c.fullContent.qrHandshake.imageKey} variant="hero" />
                            {c.fullContent.qrHandshake.callout && (
                                <div className="mt-10 rounded-xl border border-primary/[0.12] bg-primary/[0.06] p-6">
                                    <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-primary/50">Why this matters</p>
                                    <p className="text-base leading-relaxed text-foreground/90">
                                        {c.fullContent.qrHandshake.callout}
                                    </p>
                                </div>
                            )}
                        </m.section>
                    )}

                    {/* Accountability */}
                    {c.fullContent?.accountability && (
                        <Section label="Accountability">
                            <Paras text={c.fullContent.accountability.description} />
                            <CaseImage images={imgs} imageKey={c.fullContent.accountability.imageKey} caption={c.fullContent.accountability.caption} variant="hero" />
                        </Section>
                    )}

                    {/* Reflection */}
                    {c.fullContent?.reflection && (
                        <Section label="Reflection">
                            <Paras text={c.fullContent.reflection} />
                        </Section>
                    )}
                </article>
            ) : (
                /* ─────────────────────────────────────────────
                   LEGACY card-based layout
                ───────────────────────────────────────────── */
                <div className="space-y-6">
                    <Container>
                        <div className="flex flex-wrap items-center gap-2">
                            {c.tags.map((t) => <Tag key={t}>{t}</Tag>)}
                        </div>
                        <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                            {c.title}
                        </h1>
                        <p className="mt-3 text-pretty text-lg text-foreground/70">{c.outcome}</p>
                        <div className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-2">
                            {[
                                { label: "Timeline", value: c.time },
                                { label: "Focus", value: "Alignment \u2192 execution" },
                            ].map((item) => (
                                <div key={item.label} className="rounded-xl border border-border bg-background/60 px-3 py-2.5">
                                    <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">{item.label}</div>
                                    <div className="mt-0.5 text-sm font-semibold text-foreground">{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </Container>

                    {c.fullContent?.executiveSummary && (
                        <Container>
                            <h2 className="text-xl font-semibold tracking-tight text-foreground">Executive Summary</h2>
                            <Paras text={c.fullContent.executiveSummary} />
                        </Container>
                    )}

                    {c.fullContent && (
                        <Container>
                            <h2 className="text-xl font-semibold tracking-tight text-foreground">The Problem</h2>
                            <Paras text={c.fullContent.problemStatement} />
                        </Container>
                    )}

                    {c.fullContent?.users && (
                        <Container>
                            <h2 className="text-xl font-semibold tracking-tight text-foreground">Users & Environment</h2>
                            <ul className="mt-4 space-y-3">
                                {c.fullContent.users.primary.map((user, idx) => (
                                    <li key={idx} className="text-sm leading-relaxed text-foreground/80">{user}</li>
                                ))}
                            </ul>
                            <div className="mt-4 grid gap-3 md:grid-cols-2">
                                <div className="rounded-xl border border-border bg-card/80 p-4">
                                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Scale</div>
                                    <div className="mt-1 text-sm text-foreground/80">{c.fullContent.users.scale}</div>
                                </div>
                                {c.fullContent.users.environment && (
                                    <div className="rounded-xl border border-border bg-card/80 p-4">
                                        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Environment</div>
                                        <div className="mt-1 text-sm text-foreground/80">{c.fullContent.users.environment}</div>
                                    </div>
                                )}
                            </div>
                        </Container>
                    )}

                    {c.fullContent?.constraints && c.fullContent.constraints.length > 0 && (
                        <Container>
                            <h2 className="text-xl font-semibold tracking-tight text-foreground">Key Constraints</h2>
                            <div className="mt-4 space-y-3">
                                {c.fullContent.constraints.map((constraint, idx) => (
                                    <div key={idx} className="rounded-xl border border-border bg-card/80 p-4">
                                        <h3 className="text-sm font-semibold text-foreground">{constraint.title}</h3>
                                        <p className="mt-2 text-sm leading-relaxed text-foreground/80">{constraint.description}</p>
                                    </div>
                                ))}
                            </div>
                        </Container>
                    )}

                    {c.fullContent?.designStrategy && (
                        <Container>
                            <h2 className="text-xl font-semibold tracking-tight text-foreground">Design Strategy</h2>
                            <p className="mt-3 text-base leading-relaxed text-foreground/80">{c.fullContent.designStrategy}</p>
                        </Container>
                    )}

                    {c.fullContent?.solution && (
                        <Container>
                            <h2 className="text-xl font-semibold tracking-tight text-foreground">{c.fullContent.solution.title}</h2>
                            {c.fullContent.solution.description && (
                                <p className="mt-3 text-base leading-relaxed text-foreground/80">{c.fullContent.solution.description}</p>
                            )}
                            {c.fullContent.solution.steps && (
                                <ol className="mt-4 space-y-2">
                                    {c.fullContent.solution.steps.map((step, idx) => (
                                        <li key={idx} className="flex gap-3 text-sm text-foreground/80">
                                            <span className="w-4 shrink-0 pt-0.5 text-xs font-medium tabular-nums text-muted-foreground/60">{idx + 1}.</span>
                                            <span>{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            )}
                            {c.fullContent.solution.benefits && (
                                <div className="mt-4 rounded-xl border border-border bg-card/80 p-4">
                                    <h3 className="text-sm font-semibold text-foreground">This ensured:</h3>
                                    <ul className="mt-2 space-y-1">
                                        {c.fullContent.solution.benefits.map((benefit, idx) => (
                                            <li key={idx} className="flex gap-2 text-sm text-foreground/80">
                                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                                                <span>{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {c.fullContent.solution.features && (
                                <ul className="mt-4 space-y-2">
                                    {c.fullContent.solution.features.map((feature, idx) => (
                                        <li key={idx} className="flex gap-2 text-sm text-foreground/80">
                                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Container>
                    )}

                    {c.fullContent?.additionalCapabilities && c.fullContent.additionalCapabilities.length > 0 && (
                        <Container>
                            <h2 className="text-xl font-semibold tracking-tight text-foreground">Additional Capabilities</h2>
                            <ul className="mt-3 space-y-2">
                                {c.fullContent.additionalCapabilities.map((capability, idx) => (
                                    <li key={idx} className="flex gap-2 text-sm text-foreground/80">
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                                        <span>{capability}</span>
                                    </li>
                                ))}
                            </ul>
                        </Container>
                    )}

                    {c.impact.length > 0 && (
                        <Container>
                            <h2 className="text-xl font-semibold tracking-tight text-foreground">Outcome & Impact</h2>
                            <ul className="mt-4 space-y-2">
                                {c.impact.map((x, idx) => (
                                    <li key={idx} className="flex gap-2 text-sm text-foreground/80">
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                                        <span>{x}</span>
                                    </li>
                                ))}
                            </ul>
                        </Container>
                    )}

                    {c.fullContent?.reflection && (
                        <Container>
                            <h2 className="text-xl font-semibold tracking-tight text-foreground">Reflection</h2>
                            <Paras text={c.fullContent.reflection} />
                        </Container>
                    )}
                </div>
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


    // Clipboard fallback UI
    const [copyFallbackOpen, setCopyFallbackOpen] = useState(false);
    const [copyFallbackText, setCopyFallbackText] = useState("");
    const [copyFallbackTitle, setCopyFallbackTitle] = useState("Copy");

    const [toast, setToast] = useState<null | { msg: string }>(null);
    const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        };
    }, []);

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
        if (e.key === "Escape") {
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
            if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
            setToast({ msg: `${label} copied` });
            toastTimerRef.current = setTimeout(() => setToast(null), 1400);
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
                        <m.div
                            key="home"
                            {...fadeUp}
                            transition={PAGE_TRANSITION}
                            className="space-y-6"
                        >
                            <Hero
                                onPrimary={() => onNavigate("work")}
                                onSecondary={() => onNavigate("resume")}
                            />

                            <Container>
                                <div className="flex items-center justify-between gap-3">
                                    <h2 className="text-lg font-semibold text-foreground">Featured case studies</h2>
                                    <Button
                                        onClick={() => onNavigate("work")}
                                        variant="outline"
                                        className="rounded-2xl"
                                    >
                                        View all
                                        <ArrowUpRight className="h-4 w-4" />
                                    </Button>
                                </div>

                                <m.div
                                    className="mt-4 grid gap-3 md:grid-cols-2"
                                    variants={stagger}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {CASES.slice(0, 2).map((c) => (
                                        <m.div key={c.id} variants={staggerItem} className="h-full">
                                            <CaseRow
                                                c={c}
                                                href={`/case-studies/${c.id}`}
                                                onOpen={() => {
                                                    setActive("work");
                                                    setCaseId(c.id);
                                                }}
                                            />
                                        </m.div>
                                    ))}
                                </m.div>
                            </Container>
                        </m.div>
                    ) : null}

                    {active === "work" ? (
                        <m.div
                            key="work"
                            {...fadeUp}
                            transition={PAGE_TRANSITION}
                            className="space-y-6"
                        >
                            {!selectedCase ? (
                                <Container>
                                    <div className="flex flex-wrap items-end justify-between gap-3">
                                        <div>
                                            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Case Studies</h2>
                                            <p className="mt-2 max-w-2xl text-base text-muted-foreground">
                                                Design work in defense and government — from discovery and alignment through to execution.
                                            </p>
                                        </div>
                                    </div>

                                    <m.div
                                        className="mt-6 space-y-3"
                                        variants={stagger}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        {CASES.map((c) => (
                                            <m.div key={c.id} variants={staggerItem}>
                                                <CaseRow
                                                    c={c}
                                                    href={`/case-studies/${c.id}`}
                                                    onOpen={() => {
                                                        setActive("work");
                                                        setCaseId(c.id);
                                                    }}
                                                />
                                            </m.div>
                                        ))}
                                    </m.div>
                                </Container>
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
                        </m.div>
                    ) : null}

                    {active === "resume" ? (
                        <m.div
                            key="resume"
                            {...fadeUp}
                            transition={PAGE_TRANSITION}
                            className="space-y-6"
                        >
                            <Container>
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Resume</h2>
                                        <p className="mt-2 text-sm text-muted-foreground">Download or view below.</p>
                                    </div>
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="rounded-full"
                                    >
                                        <a
                                            href="/resume.pdf"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Download Resume
                                        </a>
                                    </Button>
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
                                        loading="lazy"
                                        className="h-[75vh] w-full"
                                    >
                                        <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                                            <p className="text-sm text-muted-foreground">Your browser can&apos;t display this PDF inline.</p>
                                            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-foreground underline underline-offset-4">
                                                Open PDF directly
                                            </a>
                                        </div>
                                    </iframe>
                                </div>


                                <div className="mt-6 rounded-xl border border-border bg-card/80 p-4">
                                    <div className="text-sm font-semibold text-foreground">Strategic focus</div>
                                    <div className="mt-2 text-sm text-muted-foreground">Alignment across stakeholders, constrained environments, decision clarity.</div>
                                </div>

                            </Container>
                        </m.div>
                    ) : null}

                    {active === "contact" ? (
                        <m.div
                            key="contact"
                            {...fadeUp}
                            transition={PAGE_TRANSITION}
                            className="space-y-6"
                        >
                            <Container>
                                <div>
                                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">Contact</h2>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Let's talk — reach out by email or LinkedIn.
                                    </p>
                                </div>

                                <div className="mt-6 grid gap-3 md:grid-cols-2">
                                    <button
                                        onClick={() => onCopyEmail()}
                                        className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <div>
                                            <div className="text-sm font-semibold text-foreground">Email</div>
                                            <div className="mt-1 text-sm text-muted-foreground">{EMAIL}</div>
                                        </div>
                                        <Copy className="h-4 w-4 text-muted-foreground" />
                                    </button>

                                    <a
                                        href="https://www.linkedin.com/in/wilmsas/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <div>
                                            <div className="text-sm font-semibold text-foreground">LinkedIn</div>
                                            <div className="mt-1 text-sm text-muted-foreground">Open profile</div>
                                        </div>
                                        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                                    </a>
                                </div>
                            </Container>
                        </m.div>
                    ) : null}
                </AnimatePresence>
            </main>

            {/* Tiny toast */}
            <AnimatePresence>
                {toast ? (
                    <m.div
                        {...fadeUpSm}
                        className="fixed bottom-4 left-1/2 z-40 w-[min(520px,92vw)] -translate-x-1/2 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-overlay"
                    >
                        {toast.msg}
                    </m.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}
