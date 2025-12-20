"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, FileText, Home, Mail, Grid3X3 } from "lucide-react";

const NAV = [
  { label: "Home", href: "/", icon: Home },
  { label: "Case Studies", href: "/case-studies", icon: Briefcase },
  { label: "Resume", href: "/resume", icon: FileText },
  { label: "Contact", href: "/contact", icon: Mail },
  { label: "Skills Matrix", href: "/skills-matrix", icon: Grid3X3 },
];

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div
      className="min-h-screen"
      style={
        {
          // Your Coolors palette as CSS vars (matches PortfolioMock theme approach)
          "--bg": "#F4F1DE",
          "--ink": "#3D405B",
          "--card": "rgba(255,255,255,0.60)",
          "--border": "rgba(61,64,91,0.18)",
          "--mutedText": "rgba(61,64,91,0.70)",
          "--accent": "#E07A5F",
        } as React.CSSProperties
      }
    >
      {/* Background wash */}
      <div
        className="min-h-screen"
        style={{
          background:
            "radial-gradient(1200px 500px at 20% -10%, rgba(129,178,154,0.18), rgba(255,255,255,0))," +
            "radial-gradient(900px 400px at 100% 10%, rgba(224,122,95,0.12), rgba(255,255,255,0))," +
            "var(--bg)",
        }}
      >
        {/* Navbar */}
        <header className="sticky top-0 z-50 border-b border-[color:var(--border)] bg-[color:var(--bg)]/70 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            {/* Left brand (simple) */}
            <Link href="/" className="flex items-center gap-3 text-[color:var(--ink)]">
              <div className="grid h-9 w-9 place-items-center rounded-full border border-[color:var(--border)] bg-[color:var(--card)]">
                {/* keep simple icon-dot */}
                <span className="h-2 w-2 rounded-full bg-[color:var(--accent)]" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold">Aleks</div>
                <div className="text-xs text-[color:var(--mutedText)]">Product Designer • TS-SCI</div>
              </div>
            </Link>

            {/* Nav */}
            <nav className="hidden items-center gap-1 md:flex">
              {NAV.map((n) => {
                const isOn = pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href));
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={cx(
                      "rounded-2xl px-3 py-2 text-sm font-semibold transition",
                      isOn
                        ? "bg-[color:var(--ink)] text-[color:var(--bg)]"
                        : "text-[color:var(--ink)] hover:bg-[color:var(--card)]"
                    )}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>

        {/* Page content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
