import type { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  count?: number;
  tone?: "accent" | "success" | "danger" | "warning" | "purple" | "neutral";
}

const TONE_ICON_BG: Record<NonNullable<SectionHeaderProps["tone"]>, string> = {
  accent: "bg-accent-soft text-accent-dark",
  success: "bg-success-soft text-success",
  danger: "bg-danger-soft text-danger",
  warning: "bg-warning-soft text-warning",
  purple: "bg-purple-soft text-purple",
  neutral: "bg-row-alt text-text-secondary",
};

export function SectionHeader({ icon: Icon, title, subtitle, count, tone = "accent" }: SectionHeaderProps) {
  return (
    <div className="animate-fade-in mb-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${TONE_ICON_BG[tone]}`}>
            <Icon className="h-4.5 w-4.5" strokeWidth={2} />
          </span>
          <div>
            <h3 className="font-display text-[17px] font-semibold leading-tight text-text-primary">
              {title}
            </h3>
            {subtitle && <p className="mt-0.5 text-xs text-text-secondary">{subtitle}</p>}
          </div>
        </div>
        {typeof count === "number" && (
          <span className="tabular-data rounded-full border border-border-app bg-bg-panel px-2.5 py-1 text-[11px] font-bold text-text-secondary shadow-sm">
            {count.toLocaleString()} {count === 1 ? "entry" : "entries"}
          </span>
        )}
      </div>
      <div className="mt-3.5 h-px bg-border-app" />
    </div>
  );
}
