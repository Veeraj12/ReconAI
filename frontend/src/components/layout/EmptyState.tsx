export function EmptyState() {
  return (
    <div className="flex min-h-90 animate-fade-in-up flex-col items-center justify-center gap-3 text-center text-text-secondary">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
        <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
          <path
            d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3M7 9l5-5 5 5M12 4v12"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="max-w-80 text-xs">
        Upload a bank statement and tally export in the sidebar, then start reconciliation.
      </p>
    </div>
  );
}
