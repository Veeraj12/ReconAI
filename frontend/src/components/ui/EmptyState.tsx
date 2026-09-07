import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  tone?: "neutral" | "success";
}

export function EmptyState({ icon: Icon, title, description, action, tone = "neutral" }: EmptyStateProps) {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border-app px-6 py-10 text-center">
      <span
        className={`mb-1 flex h-11 w-11 items-center justify-center rounded-full ${
          tone === "success" ? "bg-success-soft text-success" : "bg-row-alt text-text-secondary"
        }`}
      >
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <p className="text-[13px] font-semibold text-text-primary">{title}</p>
      <p className="max-w-sm text-xs text-text-secondary">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
