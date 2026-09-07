import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface ChartCardProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  children: ReactNode;
  legend?: ReactNode;
}

export function ChartCard({ icon: Icon, title, subtitle, children, legend }: ChartCardProps) {
  return (
    <div className="rounded-xl border border-border-app bg-bg-panel p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent-dark">
          <Icon className="h-4 w-4" strokeWidth={2.25} />
        </span>
        <div>
          <h5 className="font-display text-[15px] font-semibold text-text-primary">{title}</h5>
          {subtitle && <p className="text-[11px] text-text-secondary">{subtitle}</p>}
        </div>
      </div>
      {children}
      {legend && <div className="mt-4 border-t border-border-app pt-3.5">{legend}</div>}
    </div>
  );
}
