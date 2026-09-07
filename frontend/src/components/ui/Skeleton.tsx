export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function SkeletonMetricCards({ count = 5 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border-app bg-bg-panel p-4.5">
          <SkeletonBlock className="mb-3.5 h-8 w-8 rounded-lg" />
          <SkeletonBlock className="mb-2 h-3 w-20" />
          <SkeletonBlock className="h-7 w-16" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonChartCard() {
  return (
    <div className="rounded-xl border border-border-app bg-bg-panel p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <SkeletonBlock className="h-8 w-8 rounded-lg" />
        <SkeletonBlock className="h-4 w-32" />
      </div>
      <SkeletonBlock className="h-56 w-full rounded-lg" />
    </div>
  );
}

export function SkeletonTable({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-hidden rounded-md border border-border-app">
      <div className="flex gap-4 border-b border-border-app bg-row-alt px-2.5 py-2.5">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonBlock key={i} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 border-b border-border-app px-2.5 py-3">
          {Array.from({ length: cols }).map((_, c) => (
            <SkeletonBlock key={c} className="h-3 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonWorkspaceSection() {
  return (
    <div className="rounded-xl border border-border-app bg-bg-panel p-5">
      <div className="mb-4 flex items-center gap-3">
        <SkeletonBlock className="h-9 w-9 rounded-lg" />
        <div className="flex-1">
          <SkeletonBlock className="mb-1.5 h-4 w-40" />
          <SkeletonBlock className="h-3 w-64" />
        </div>
      </div>
      <SkeletonTable />
    </div>
  );
}
