export default function AdminLoading() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>

      <div className="pb-8 border-b border-rule mb-8">
        <div className="h-3 w-24 bg-cream-deep rounded-sm mb-3" />
        <div className="h-8 w-72 bg-cream-deep rounded-sm mb-2" />
        <div className="h-4 w-96 bg-cream-warm rounded-sm" />
      </div>

      <div className="space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 border border-rule px-4 py-4 bg-cream-warm/40"
          >
            <div className="h-12 w-12 bg-cream-deep rounded-sm flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-cream-deep rounded-sm" />
              <div className="h-3 w-1/2 bg-cream-warm rounded-sm" />
            </div>
            <div className="h-8 w-24 bg-cream-deep rounded-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
