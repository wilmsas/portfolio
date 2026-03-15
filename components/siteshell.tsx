"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LazyMotion, domAnimation } from "framer-motion";
import { Home, Briefcase, FileText, Mail } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Home",         short: "Home",    href: "/",              icon: Home },
  { label: "Case Studies", short: "Work",    href: "/case-studies",  icon: Briefcase },
  { label: "Resume",       short: "Resume",  href: "/resume",        icon: FileText },
  { label: "Contact",      short: "Contact", href: "/contact",       icon: Mail },
];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3 text-foreground">
            <div className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background">
              <span className="h-2 w-2 rounded-full bg-primary" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">Aleks</div>
              <div className="text-xs text-muted-foreground">Product Designer • TS-SCI</div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-1 md:flex">
              {NAV.map((n) => {
                const isOn = pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href));
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={cn(
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

      <main className="pb-16 md:pb-0">
        <LazyMotion features={domAnimation} strict>
          {children}
        </LazyMotion>
      </main>

      {/* Mobile bottom navigation — replaces the hidden desktop nav */}
      <nav
        aria-label="Main navigation"
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden"
      >
        <div className="flex items-stretch">
          {NAV.map((n) => {
            const isOn = pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href));
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 px-1 py-2.5 text-[11px] font-medium transition-colors",
                  isOn ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5 transition-all duration-200", isOn ? "text-foreground scale-110" : "text-muted-foreground scale-100")} />
                {n.short}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
