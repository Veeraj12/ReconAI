"use client";

import { Download, RefreshCcw, Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { StatusBadge } from "../ui/StatusBadge";

interface ToolbarProps {
  title: string;
  lastRunLabel?: string;
  isReady: boolean;
  isDark: boolean;
  onToggleTheme: () => void;
  onSearch?: (query: string) => void;
  onExport?: () => void;
  onRerun?: () => void;
}

export function Toolbar({
  title,
  lastRunLabel,
  isReady,
  isDark,
  onToggleTheme,
  onSearch,
  onExport,
  onRerun,
}: ToolbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-[var(--toolbar-height)] items-center justify-between gap-4 border-b border-border-app bg-bg-panel/85 px-5 backdrop-blur-md">
      <div className="flex min-w-0 items-center gap-3">
        <div className="min-w-0">
          <h1 className="font-display truncate text-[17px] font-semibold leading-none text-text-primary">
            {title}
          </h1>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-text-secondary">
            <StatusBadge tone={isReady ? "success" : "neutral"}>
              {isReady ? "Ready" : "Awaiting files"}
            </StatusBadge>
            {lastRunLabel && <span>Last reconciliation · {lastRunLabel}</span>}
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2.5">
        {onSearch && (
          <div className="relative hidden max-w-xs flex-1 sm:block">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search reference, amount..."
              onChange={(e) => onSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-border-app bg-bg-content pl-8 pr-3 text-xs text-text-primary placeholder:text-text-secondary/70 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
        )}

        {onRerun && (
          <button
            type="button"
            onClick={onRerun}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-border-app bg-bg-panel px-3 text-xs font-semibold text-text-primary transition-all duration-150 hover:border-accent hover:text-accent-dark active:scale-95"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Re-run</span>
          </button>
        )}

        {onExport && (
          <button
            type="button"
            onClick={onExport}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-accent px-3.5 text-xs font-semibold text-white shadow-sm transition-all duration-150 hover:bg-accent-dark active:scale-95"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Export</span>
          </button>
        )}

        <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}
