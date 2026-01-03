"use client";

import { useState, useEffect } from "react";

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
    // Check if already authenticated
    const stored = sessionStorage.getItem(storageKey);
    if (stored === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
    }
  }, [storageKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      sessionStorage.setItem(storageKey, password);
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  };

  // Don't render until client-side to avoid hydration mismatch
  if (!isClient) {
    return null;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen">
      {/* Blurred content behind */}
      <div className="pointer-events-none select-none blur-xl">
        {children}
      </div>

      {/* Password overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
          <h2 className="mb-2 text-2xl font-semibold text-foreground">
            Password Required
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            This page is password-protected. Please enter the password to continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className={`w-full rounded-lg border px-4 py-2.5 text-foreground transition focus:outline-none focus:ring-2 ${
                  error
                    ? "border-destructive bg-destructive/10 focus:ring-destructive"
                    : "border-border bg-background focus:ring-ring"
                }`}
                placeholder="Enter password"
                autoFocus
                autoComplete="off"
              />
              {error && (
                <p className="mt-2 text-sm text-destructive">
                  Incorrect password. Please try again.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
