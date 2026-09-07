export function ConfidenceMeter({ value, label = "Pattern confidence" }: { value: number; label?: string }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  const tone = pct >= 80 ? "bg-success" : pct >= 50 ? "bg-warning" : "bg-danger";

  return (
    <div className="flex items-center gap-2" title={`${label}: ${pct}%`}>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-row-alt">
        <div className={`h-full rounded-full ${tone} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className="tabular-data text-[11px] font-semibold text-text-secondary">{pct}%</span>
    </div>
  );
}
