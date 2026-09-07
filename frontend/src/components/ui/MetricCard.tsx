import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export type MetricTone = "neutral" | "success" | "danger" | "accent";

const TONE_GRADIENT: Record<MetricTone, string> = {
  neutral: "bg-[image:var(--grad-neutral)]",
  success: "bg-[image:var(--grad-success)]",
  danger: "bg-[image:var(--grad-danger)]",
  accent: "bg-[image:var(--grad-accent)]",
};

const TONE_ICON: Record<MetricTone, string> = {
  neutral: "bg-row-alt text-text-secondary",
  success: "bg-success-soft text-success",
  danger: "bg-danger-soft text-danger",
  accent: "bg-accent-soft text-accent-dark",
};

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string;
  tone?: MetricTone;
  trend?: { value: number; label: string };
}

export function MetricCard({ icon: Icon, label, value, subtitle, tone = "neutral", trend }: MetricCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border-app bg-bg-panel shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className={`absolute inset-x-0 top-0 h-[3px] ${TONE_GRADIENT[tone]}`} />
      <div className="p-4.5">
        <div className="mb-3.5 flex items-center justify-between">
          <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${TONE_ICON[tone]}`}>
            <Icon className="h-4 w-4" strokeWidth={2.25} />
          </span>
          {trend && (
            <span
              className={`flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                trend.value >= 0 ? "bg-success-soft text-success" : "bg-danger-soft text-danger"
              }`}
            >
              {trend.value >= 0 ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {Math.abs(trend.value)}%
            </span>
          )}
        </div>

        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
          {label}
        </div>
        <div className="font-display tabular-data text-[28px] font-semibold leading-none text-text-primary">
          {value}
        </div>
        {subtitle && <div className="mt-1.5 text-[11px] text-text-secondary">{subtitle}</div>}
        {trend && <div className="mt-1.5 text-[11px] text-text-secondary">{trend.label}</div>}
      </div>
    </div>
  );
}
