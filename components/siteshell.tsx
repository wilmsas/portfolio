"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, FileText, Home, Mail, Grid3X3 } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "next-themes";

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
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Left brand (simple) */}
          <Link href="/" className="flex items-center gap-3 text-foreground">
            <div className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background">
              {/* keep simple icon-dot */}
              <span className="h-2 w-2 rounded-full bg-primary" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">Aleks</div>
              <div className="text-xs text-muted-foreground">Product Designer • TS-SCI</div>
            </div>
          </Link>

          {/* Nav */}
          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-1 md:flex">
              {NAV.map((n) => {
                const isOn = pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href));
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={cx(
                      "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                      isOn
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Page content */}
      <main>{children}</main>
    </div>
  );
}
