"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { m, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Layout primitives ── */

function Narrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-[620px] px-4 md:px-6", className)}>
      {children}
    </div>
  );
}

function Wide({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-[920px] px-4 md:px-6", className)}>
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div className="mx-auto max-w-[620px] px-4 py-16 md:px-6">
      <hr className="border-border" />
    </div>
  );
}

/* ── Animation wrapper — respects prefers-reduced-motion ── */

function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </m.div>
  );
}

/* ── Image paths ── */

const IMG = {
  counseling: "/images/case-studies/mysquad/01_counseling_entry.png",
  setup: "/images/case-studies/mysquad/02_session_setup.png",
  content: "/images/case-studies/mysquad/03_session_content.png",
  accountability: "/images/case-studies/mysquad/05_accountability.png",
} as const;

/* ── Main component ── */

export default function MySquadCaseStudy() {
  return (
    <div className="pb-24">
      {/* ── Back ── */}
      <Narrow className="pt-8 pb-12">
        <Link
          href="/case-studies"
          className="group inline-flex min-h-[44px] items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 ease-out group-hover:-translate-x-1" />
          Back
        </Link>
      </Narrow>

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <Narrow>
        <FadeIn>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Perfecting the squad
          </h1>
          <p className="mt-4 text-lg text-foreground/70">
            Digitizing Army leadership without losing what makes it human
          </p>
          <div className="mt-8 flex flex-wrap gap-x-10 gap-y-3">
            {[
              { label: "Timeline", value: "8 months" },
              { label: "Role", value: "Product Designer" },
              { label: "Scale", value: "Army-wide" },
              { label: "Launched", value: "AUSA 2021" },
            ].map((item) => (
              <div key={item.label}>
                <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground/70">
                  {item.label}
                </div>
                <div className="mt-1 text-sm font-medium text-foreground">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </Narrow>

      {/* ── Opening text ── */}
      <Narrow className="mt-12">
        <FadeIn>
          <p className="text-base leading-relaxed text-foreground/85">
            In 2021, the Sergeant Major of the Army gave the Army Software
            Factory a simple directive. What followed was an 8-month sprint to
            build a squad-level tool deployed across every enlisted rank in the
            U.S. Army.
          </p>
        </FadeIn>
      </Narrow>

      {/* ── Pull-quote ── */}
      <Narrow className="mt-12 text-center">
        <FadeIn>
          <blockquote className="font-serif text-xl italic leading-relaxed text-foreground">
            &ldquo;Make a kick-ass app for squad leaders.&rdquo;
          </blockquote>
          <p className="mt-3 text-sm text-muted-foreground">
            &mdash; SMA Grinston, directive to the Army Software Factory
          </p>
        </FadeIn>
      </Narrow>

      <Divider />

      {/* ═══════════════════════════════════════════
          THE PROBLEM
      ═══════════════════════════════════════════ */}
      <Narrow>
        <FadeIn>
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            The problem
          </p>
          <h2 className="mb-5 text-2xl font-semibold tracking-tight">
            Paper forms in a mobile-first world
          </h2>
          <div className="space-y-4">
            <p className="text-base leading-relaxed text-foreground/85">
              Counseling &mdash; a mandatory monthly conversation between NCOs
              and their Soldiers &mdash; lived entirely on paper. DA Form 4856
              had to be filled out by hand, signed in person, and physically
              filed. Accountability was a mental exercise: who&rsquo;s present,
              who&rsquo;s on leave, who&rsquo;s TDY. Readiness data was
              scattered across disconnected systems that squad leaders rarely
              had time to check.
            </p>
            <p className="text-base leading-relaxed text-foreground/85">
              Leaders spent their limited time on paperwork instead of people.
            </p>
          </div>
        </FadeIn>
      </Narrow>

      {/* ── Pull-quote ── */}
      <Narrow className="mt-12 text-center">
        <FadeIn>
          <blockquote className="font-serif text-xl italic leading-relaxed text-foreground">
            &ldquo;I&rsquo;d rather PCS to Fort Polk than conduct another 4856
            counseling.&rdquo;
          </blockquote>
          <p className="mt-3 text-sm text-muted-foreground">
            &mdash; 101st IN Specialist (E-4), during user research
          </p>
        </FadeIn>
      </Narrow>

      <Divider />

      {/* ═══════════════════════════════════════════
          BEFORE
      ═══════════════════════════════════════════ */}
      <Narrow>
        <FadeIn>
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Before
          </p>
          <h2 className="mb-5 text-2xl font-semibold tracking-tight">
            Design by committee, not system
          </h2>
          <p className="text-base leading-relaxed text-foreground/85">
            When we inherited MySquad, it had a functional backend but a
            disjointed frontend with no meaningful design system. We tore it
            down completely and rebuilt it from scratch.
          </p>
        </FadeIn>
      </Narrow>

      <Divider />

      {/* ═══════════════════════════════════════════
          USERS & ENVIRONMENT
      ═══════════════════════════════════════════ */}
      <Narrow>
        <FadeIn>
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Users &amp; environment
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border p-5">
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                Primary users
              </h3>
              <p className="text-sm leading-relaxed text-foreground/80">
                <strong>Junior NCOs (Counselors):</strong> team leaders and
                squad leaders responsible for monthly counseling, daily
                accountability, and task management.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                <strong>Enlisted Soldiers (Counselees):</strong> the recipients
                of counseling sessions who needed to review, acknowledge, and
                sign documentation.
              </p>
            </div>
            <div className="rounded-xl border border-border p-5">
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                Environment
              </h3>
              <p className="text-sm leading-relaxed text-foreground/80">
                Mobile-first by necessity. Squad leaders operate in motor pools,
                field environments, and barracks &mdash; not behind desks. Any
                solution had to work on a phone, in low-connectivity conditions,
                and fit into the pace of a squad leader&rsquo;s day.
              </p>
            </div>
          </div>
        </FadeIn>
      </Narrow>

      <Divider />

      {/* ═══════════════════════════════════════════
          DISCOVERY
      ═══════════════════════════════════════════ */}
      <Narrow>
        <FadeIn>
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Discovery
          </p>
          <h2 className="mb-5 text-2xl font-semibold tracking-tight">
            15+ interviews across unit types
          </h2>
          <div className="space-y-4">
            <p className="text-base leading-relaxed text-foreground/85">
              We started broad. If the SMA wanted a &ldquo;kick-ass app for
              squad leaders,&rdquo; we needed to understand what actually made
              their days painful &mdash; not what senior leaders assumed the
              problems were.
            </p>
            <p className="text-base leading-relaxed text-foreground/85">
              We conducted over 15 user interviews and usability sessions across
              a range of unit types &mdash; infantry, signal, maintenance, and
              others &mdash; using a mix of 1-on-1 interviews, focus groups, and
              group sessions. The diversity was intentional: a squad
              leader&rsquo;s pain points in an infantry company look different
              from those in a signal battalion, but the administrative burden is
              universal.
            </p>
            <p className="text-base leading-relaxed text-foreground/85">
              This pointed us directly at two features: a digital counseling
              workflow and a daily accountability tracker.
            </p>
          </div>

          {/* Insight callout — research finding */}
          <div className="mt-8 rounded-xl border border-border bg-card/60 p-5">
            <p className="text-sm font-medium leading-relaxed text-foreground">
              &ldquo;Squad leaders didn&rsquo;t need another dashboard. They
              needed their administrative burden reduced so they could spend
              more time leading.&rdquo;
            </p>
          </div>
        </FadeIn>
      </Narrow>

      <Divider />

      {/* ═══════════════════════════════════════════
          THE CRITICAL CONSTRAINT
      ═══════════════════════════════════════════ */}
      <Narrow>
        <FadeIn>
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            The critical constraint
          </p>
          <h2 className="mb-5 text-2xl font-semibold tracking-tight">
            Don&rsquo;t digitize the conversation
          </h2>
          <div className="space-y-4">
            <p className="text-base leading-relaxed text-foreground/85">
              Army counseling is not a form. It&rsquo;s a face-to-face
              conversation between a leader and their Soldier &mdash; intended
              to be personal, developmental, and meaningful. The paper form (DA
              4856) is just the record of that conversation. Digitizing the form
              was straightforward. The real risk was that digitizing the{" "}
              <em>record</em> would inadvertently digitize the{" "}
              <em>interaction</em> &mdash; enabling NCOs to skip the
              conversation entirely and just fill out a form on their phone.
            </p>
          </div>

          {/* Insight callout — design principle, differentiated with left accent */}
          <div className="mt-8 rounded-xl border border-primary/20 bg-primary/[0.04] p-5">
            <p className="text-sm font-medium leading-relaxed text-foreground">
              &ldquo;We had to translate a paper-based artifact into a digital
              one without digitizing the interaction itself.&rdquo;
            </p>
          </div>

          <p className="mt-6 text-base leading-relaxed text-foreground/85">
            The biggest pushback from NCOs during research validated this
            concern: they didn&rsquo;t want the tool to enable fake counselings.
            We had to design an accountability mechanism into the workflow
            itself.
          </p>
        </FadeIn>
      </Narrow>

      <Divider />

      {/* ═══════════════════════════════════════════
          THE SOLUTION — STARTING A SESSION
      ═══════════════════════════════════════════ */}
      <Narrow>
        <FadeIn>
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            The solution
          </p>
          <h2 className="mb-5 text-2xl font-semibold tracking-tight">
            Starting a counseling session
          </h2>
          <p className="text-base leading-relaxed text-foreground/85">
            The counselor creates a new session from the home screen &mdash;
            choosing from a blank form, a template, or a specific counseling
            type. Everything scaffolds before data entry begins.
          </p>
        </FadeIn>
      </Narrow>

      <Wide className="mt-10">
        <FadeIn>
          <Image
            src={IMG.counseling}
            alt="Counseling entry flow showing home screen, new counseling options, and type selection"
            width={1920}
            height={1080}
            priority
            className="h-auto w-full rounded-lg ring-1 ring-border/40"
          />
        </FadeIn>
      </Wide>

      <Divider />

      {/* ═══════════════════════════════════════════
          SESSION SETUP
      ═══════════════════════════════════════════ */}
      <Narrow>
        <FadeIn>
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Session setup
          </p>
          <h2 className="mb-5 text-2xl font-semibold tracking-tight">
            Soldier selection &amp; context
          </h2>
          <p className="text-base leading-relaxed text-foreground/85">
            The counselor searches for and selects the Soldier. Administrative
            data auto-populates from the roster &mdash; no manual entry.
            Background information surfaces readiness metrics directly into the
            counseling context.
          </p>
        </FadeIn>
      </Narrow>

      <Wide className="mt-10">
        <FadeIn>
          <Image
            src={IMG.setup}
            alt="Session setup showing soldier search, admin data, and readiness information"
            width={1920}
            height={1080}
            className="h-auto w-full rounded-lg ring-1 ring-border/40"
          />
        </FadeIn>
      </Wide>

      <Divider />

      {/* ═══════════════════════════════════════════
          DOCUMENTING
      ═══════════════════════════════════════════ */}
      <Narrow>
        <FadeIn>
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Documenting
          </p>
          <h2 className="mb-5 text-2xl font-semibold tracking-tight">
            Mirroring the DA 4856
          </h2>
          <p className="text-base leading-relaxed text-foreground/85">
            The full counseling session mirrors the DA 4856 structure exactly.
            Key points, plan of action, and session closing. A guided SMART goal
            wizard walks through each dimension so goals are structured, not
            vague.
          </p>
        </FadeIn>
      </Narrow>

      <Wide className="mt-10">
        <FadeIn>
          <Image
            src={IMG.content}
            alt="Session documentation showing full session view, SMART goal wizard, and completed counseling"
            width={1920}
            height={1080}
            className="h-auto w-full rounded-lg ring-1 ring-border/40"
          />
        </FadeIn>
      </Wide>

      <Divider />

      {/* ═══════════════════════════════════════════
          THE QR HANDSHAKE
      ═══════════════════════════════════════════ */}
      <Narrow>
        <FadeIn>
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Enforcing presence
          </p>
          <h2 className="mb-5 text-2xl font-semibold tracking-tight">
            The QR handshake
          </h2>
          <p className="text-base leading-relaxed text-foreground/85">
            The most critical design decision was how we handled signatures. We
            needed to prove both parties were physically present &mdash; without
            DocuSign &mdash; within a government web app.
          </p>

          {/* Stepped timeline — semantic ordered list */}
          <ol className="relative mt-10 list-none p-0">
            {[
              {
                lead: "Counselor completes the session.",
                detail: "The conversation happens in person.",
              },
              {
                lead: "Unique QR code generated.",
                detail: "Tied to that session only.",
              },
              {
                lead: "Counselee scans on their device.",
                detail: "Physical proximity required.",
              },
              {
                lead: "Both sign with custom signature block.",
                detail: "Finger-drawn, built from scratch.",
              },
              {
                lead: "DA 4856 PDF generated.",
                detail: "Every field compiled into the official form.",
              },
            ].map((step, idx, arr) => (
              <li key={idx} className="relative flex gap-5 pb-8 last:pb-0">
                {idx < arr.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="absolute left-[13px] top-7 h-full w-px bg-primary/20"
                  />
                )}
                <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-mono text-[11px] tabular-nums text-primary">
                  {idx + 1}
                </div>
                <p className="pt-0.5 text-sm leading-relaxed text-foreground/85">
                  <strong className="text-foreground">{step.lead}</strong>{" "}
                  {step.detail}
                </p>
              </li>
            ))}
          </ol>
        </FadeIn>
      </Narrow>

      {/* Bold callout paragraph */}
      <Narrow className="mt-10">
        <FadeIn>
          <p className="text-base font-medium leading-relaxed text-foreground">
            This wasn&rsquo;t just a digital convenience &mdash; it was an
            integrity mechanism. The QR handshake made it impossible to complete
            a counseling asynchronously. No remote sign-offs. No post-hoc
            signatures. No checkbox counselings.
          </p>
        </FadeIn>
      </Narrow>

      <Divider />

      {/* ═══════════════════════════════════════════
          ACCOUNTABILITY
      ═══════════════════════════════════════════ */}
      <Narrow>
        <FadeIn>
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Squad accountability
          </p>
          <h2 className="mb-5 text-2xl font-semibold tracking-tight">
            Knowing where your people are
          </h2>
          <p className="text-base leading-relaxed text-foreground/85">
            The second major feature addressed daily accountability &mdash;
            who&rsquo;s present, who&rsquo;s TDY, who&rsquo;s on leave,
            who&rsquo;s on sick call. Create an event, push notification,
            collect responses. Real-time totals ready to relay up the chain.
          </p>
        </FadeIn>
      </Narrow>

      <Wide className="mt-10">
        <FadeIn>
          <Image
            src={IMG.accountability}
            alt="Accountability flow showing event creation, push notification, and totals view"
            width={1920}
            height={1080}
            className="h-auto w-full rounded-lg ring-1 ring-border/40"
          />
        </FadeIn>
      </Wide>

      <Divider />

      {/* ═══════════════════════════════════════════
          REFLECTION
      ═══════════════════════════════════════════ */}
      <Narrow>
        <FadeIn>
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Reflection
          </p>
          <div className="space-y-4">
            <p className="text-base leading-relaxed text-foreground/85">
              MySquad taught me that the hardest design problems aren&rsquo;t
              about interfaces &mdash; they&rsquo;re about values. The
              counseling workflow succeeded because we refused to treat
              digitization as a feature request. We treated it as a trust
              problem: how do you give leaders a better tool without giving bad
              actors an easier shortcut?
            </p>
            <p className="text-base leading-relaxed text-foreground/85">
              The answer was designing accountability into the system itself. The
              QR handshake wasn&rsquo;t a technical flex &mdash; it was a direct
              response to what NCOs told us they were afraid of.
            </p>
            <p className="text-base leading-relaxed text-foreground/85">
              Working at the Army Software Factory shaped how I think about
              scale. Designing for every squad leader in the Army means designing
              for wildly different contexts, technical literacy levels, and
              leadership cultures.
            </p>
          </div>
        </FadeIn>
      </Narrow>
    </div>
  );
}
