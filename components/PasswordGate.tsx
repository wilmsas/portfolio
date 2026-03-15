"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PasswordGateProps {
  children: React.ReactNode;
  storageKey: string;
}

export default function PasswordGate({ children, storageKey }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const CORRECT_PASSWORD = "skills";

  useEffect(() => {
    setIsClient(true);
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored === CORRECT_PASSWORD) {
        setIsAuthenticated(true);
      }
    } catch {
      // sessionStorage unavailable (private browsing, storage full, etc.)
    }
  }, [storageKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      try {
        sessionStorage.setItem(storageKey, password);
      } catch {
        // sessionStorage unavailable — auth still succeeds for this session
      }
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  };

  if (!isClient) return null;
  if (isAuthenticated) return <>{children}</>;

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none select-none blur-xl">{children}</div>

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
          <h2 className="mb-2 text-2xl font-semibold text-foreground">Password Required</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            This section requires a password to access.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                error={error}
                placeholder="Enter password"
                autoFocus
                autoComplete="off"
              />
              {error && (
                <p className="mt-2 text-sm text-destructive">Incorrect password. Please try again.</p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg">
              Continue
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
