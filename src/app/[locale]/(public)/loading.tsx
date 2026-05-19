export default function Loading() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="min-h-[72vh] flex flex-col gap-8 px-[clamp(20px,4vw,56px)] py-32 max-w-[1320px] mx-auto"
    >
      <div className="h-3 w-24 bg-rule/60 rounded-sm animate-pulse" />
      <div className="h-14 md:h-20 w-3/4 bg-rule/60 rounded-sm animate-pulse" />
      <div className="h-5 w-2/3 bg-rule/40 rounded-sm animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[4/5] bg-rule/40 rounded-sm animate-pulse"
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
