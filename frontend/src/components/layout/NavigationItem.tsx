import type { LucideIcon } from "lucide-react";

interface NavigationItemProps {
  icon: LucideIcon;
  label: string;
  count?: number;
  active?: boolean;
  collapsed?: boolean;
  onClick: () => void;
}

export function NavigationItem({
  icon: Icon,
  label,
  count,
  active = false,
  collapsed = false,
  onClick,
}: NavigationItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={collapsed ? label : undefined}
      aria-current={active ? "true" : undefined}
      className={[
        "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition-all duration-180",
        "min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
        collapsed ? "justify-center px-0" : "",
        active
          ? "bg-white/10 text-text-inverse"
          : "text-text-inverse-muted hover:bg-white/5 hover:text-text-inverse",
      ].join(" ")}
    >
      {/* Active indicator bar */}
      <span
        className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-accent transition-all duration-200 ${
          active ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
        }`}
      />
      <Icon
        className={`h-4.5 w-4.5 shrink-0 transition-transform duration-180 ${
          active ? "text-accent" : "text-text-inverse-muted group-hover:text-text-inverse"
        } group-active:scale-90`}
        strokeWidth={2}
      />
      {!collapsed && <span className="flex-1 truncate">{label}</span>}
      {!collapsed && typeof count === "number" && count > 0 && (
        <span
          className={`tabular-data rounded-full px-1.5 py-0.5 text-[10px] font-bold transition-colors ${
            active ? "bg-accent/25 text-accent" : "bg-white/10 text-text-inverse-muted"
          }`}
        >
          {count.toLocaleString()}
        </span>
      )}
    </button>
  );
}
