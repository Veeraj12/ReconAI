import type { ReactNode } from "react";

export type BadgeTone = "success" | "danger" | "warning" | "info" | "purple" | "neutral" | "accent";

const TONE_STYLES: Record<BadgeTone, string> = {
  success: "border-success/35 bg-success-soft text-success",
  danger: "border-danger/35 bg-danger-soft text-danger",
  warning: "border-warning/35 bg-warning-soft text-warning",
  info: "border-info/35 bg-info-soft text-info",
  purple: "border-purple/35 bg-purple-soft text-purple",
  neutral: "border-border-app bg-row-alt text-text-secondary",
  accent: "border-accent/35 bg-accent-soft text-accent-dark",
};

interface StatusBadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  icon?: ReactNode;
  /** Applies the rubber-stamp tilt + double-border treatment — the
   * redesign's signature motif, reserved for the handful of badges
   * that mark a definitive outcome (matched, exception, duplicate). */
  stamped?: boolean;
}

export function StatusBadge({ children, tone = "neutral", icon, stamped = false }: StatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-transform duration-150",
        TONE_STYLES[tone],
        stamped
          ? "-rotate-2 border-2 shadow-[0_0_0_2px_rgba(0,0,0,0.02)] hover:rotate-0"
          : "",
      ].join(" ")}
    >
      {icon}
      {children}
    </span>
  );
}
