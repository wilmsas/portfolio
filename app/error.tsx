"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <p className="mb-3 text-sm text-[color:var(--mutedText)]">Something broke</p>
      <h1 className="text-3xl font-semibold text-[color:var(--ink)]">
        Unexpected error.
      </h1>
      <p className="mt-4 max-w-xl text-[color:var(--ink)]/80">
        Try reloading. If it persists, it’s on me — not you.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          onClick={() => reset()}
          className="rounded-full border border-[color:var(--border)] bg-[color:var(--pill)] px-4 py-2 text-sm font-medium"
        >
          Try again
        </button>
        <a
          href="/"
          className="rounded-full border border-[color:var(--border)] bg-[color:var(--card)] px-4 py-2 text-sm font-medium"
        >
          Go home
        </a>
      </div>

      {/* Keep details hidden by default; useful in dev */}
      <details className="mt-10">
        <summary className="cursor-pointer text-sm text-[color:var(--mutedText)]">
          Technical details
        </summary>
        <pre className="mt-3 overflow-auto rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] p-4 text-xs text-[color:var(--ink)]/80">
          {error?.message}
          {error?.digest ? `\n\ndigest: ${error.digest}` : ""}
        </pre>
      </details>
    </main>
  );
}
