"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  FileWarning,
  Lightbulb,
  LogOut,
  Scale,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import { NavigationItem } from "./NavigationItem";
import type { AuthUser } from "@/lib/types";

export interface WorkspaceSectionDef {
  id: string;
  label: string;
  icon: typeof CheckCircle2;
  count: number;
}

interface SidebarProps {
  user?: AuthUser | null;
  sections: WorkspaceSectionDef[];
  activeId: string;
  onNavigate: (id: string) => void;
  onLogout?: () => void;
}

export const DEFAULT_SECTION_ICONS = {
  matched: CheckCircle2,
  missingBank: FileWarning,
  missingTally: FileWarning,
  exceptions: Scale,
  dropped: Trash2,
  duplicates: Copy,
  hints: Lightbulb,
};

export function Sidebar({ user, sections, activeId, onNavigate, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`sticky top-0 flex h-screen shrink-0 flex-col border-r border-border-dark bg-bg-app transition-[width] duration-220 ease-out ${
        collapsed ? "w-[var(--sidebar-width-collapsed)]" : "w-[var(--sidebar-width)]"
      }`}
    >
      {/* Brand */}
      <div className={`flex h-[var(--toolbar-height)] items-center border-b border-border-dark ${collapsed ? "justify-center px-0" : "gap-2.5 px-5"}`}>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-white shadow-[var(--shadow-glow-accent)]">
          <ShieldCheck className="h-4.5 w-4.5" strokeWidth={2.25} />
        </span>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-display truncate text-[15px] font-semibold leading-none text-text-inverse">
              ReconAI
            </p>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-text-inverse-muted">
              Reconciliation
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-2.5 py-4">
        {!collapsed && (
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-text-inverse-muted">
            Workspace
          </p>
        )}
        {sections.map((s) => (
          <NavigationItem
            key={s.id}
            icon={s.icon}
            label={s.label}
            count={s.count}
            active={activeId === s.id}
            collapsed={collapsed}
            onClick={() => onNavigate(s.id)}
          />
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="px-2.5 pb-2">
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg text-text-inverse-muted transition-colors duration-150 hover:bg-white/5 hover:text-text-inverse focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : (
            <>
              <ChevronsLeft className="h-4 w-4" />
              <span className="text-xs font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* Footer */}
      <div className={`space-y-2 border-t border-border-dark p-2.5 ${collapsed ? "px-1.5" : ""}`}>
        {/* Local processing card */}
        <div
          title={collapsed ? "All processing happens on this device" : undefined}
          className={`rounded-lg border border-border-dark bg-bg-app-soft ${collapsed ? "flex justify-center p-2" : "p-3"}`}
        >
          <div className={`flex items-center gap-2 ${collapsed ? "" : "mb-1"}`}>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-success/15 text-success">
              <ShieldCheck className="h-3.5 w-3.5" />
            </span>
            {!collapsed && (
              <span className="text-[11px] font-semibold text-text-inverse">Local Processing</span>
            )}
          </div>
          {!collapsed && (
            <p className="text-[10.5px] leading-snug text-text-inverse-muted">
              Files never leave this device. Everything runs on-machine.
            </p>
          )}
        </div>

        {/* User profile card */}
        <div
          className={`group flex items-center rounded-lg transition-colors duration-150 hover:bg-white/5 ${
            collapsed ? "justify-center p-2" : "gap-2.5 p-2"
          }`}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
            <UserRound className="h-4 w-4" />
          </span>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-semibold text-text-inverse">
                {user?.username ?? "Guest"}
              </p>
              <p className="truncate text-[10.5px] capitalize text-text-inverse-muted">
                {user?.role ?? "viewer"}
              </p>
            </div>
          )}
          {!collapsed && onLogout && (
            <button
              type="button"
              onClick={onLogout}
              aria-label="Log out"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-text-inverse-muted opacity-0 transition-all duration-150 hover:bg-white/10 hover:text-danger group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
