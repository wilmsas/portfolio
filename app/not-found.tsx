export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <p className="mb-3 text-sm text-[color:var(--mutedText)]">404</p>
      <h1 className="text-3xl font-semibold text-[color:var(--ink)]">
        This page doesn’t exist.
      </h1>
      <p className="mt-4 max-w-xl text-[color:var(--ink)]/80">
        The link may be broken, or the page may have moved.
      </p>
      <a
        href="/"
        className="mt-8 inline-block text-sm font-medium underline underline-offset-4"
      >
        Go back home
      </a>
    </main>
  );
}
