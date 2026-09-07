"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAuth } from "@/features/auth/useAuth";
import { useReconciliationContext } from "@/features/reconciliation/ReconciliationProvider";
import { UploadForm } from "@/features/reconciliation/components/UploadForm";

const RESULT_TABS = [
  { value: "matched", label: "Matched", icon: "✓" },
  { value: "missingBank", label: "Missing In Bank", icon: "–" },
  { value: "missingTally", label: "Missing In Tally", icon: "–" },
  { value: "exceptions", label: "Exceptions", icon: "!" },
  { value: "droppedRows", label: "Dropped Rows", icon: "⊗" },
  { value: "duplicates", label: "Duplicates", icon: "⧉" },
  { value: "hints", label: "Sign Reversal Hints", icon: "i" },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useLocalStorage("reconai:sidebarCollapsed", false);
  const { user, logout } = useAuth();
  const { data, isLoading, upload, reset } = useReconciliationContext();

  const badgeCount: Record<string, number> = data
    ? {
        exceptions:
          data.exceptions.amountMismatches.length +
          data.exceptions.typeMismatches.length +
          data.exceptions.groupedMatches.length,
        droppedRows: data.invalidBankRowData.length + data.invalidTallyRowData.length,
        duplicates: data.duplicates.bank.length + data.duplicates.tally.length,
        hints: data.signReversalHints.length,
      }
    : {};

  return (
    <aside
      className={`flex flex-col overflow-x-hidden overflow-y-auto bg-bg-app px-4.5 py-5 text-text-inverse transition-[width,padding] duration-250 ${
        collapsed ? "w-16 px-3" : "w-66"
      }`}
    >
      <div
        className={`mb-5 flex border-b border-border-dark pb-5 ${
          collapsed ? "flex-col items-center gap-3" : "items-center gap-2.5"
        }`}
      >
        <span className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg bg-accent text-base font-bold text-white">
          R
        </span>

        {!collapsed && (
          <div className="flex flex-col overflow-hidden leading-tight">
            <span className="whitespace-nowrap text-sm font-bold text-white">ReconAI</span>
            <span className="whitespace-nowrap text-[11px] text-text-inverse-muted">
              Bank &amp; Tally Reconciliation
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-dark bg-bg-app-soft text-text-inverse-muted transition-all duration-200 hover:border-accent hover:bg-accent/15 hover:text-white active:scale-90 ${
            collapsed ? "" : "ml-auto"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={`h-4.5 w-4.5 transition-transform duration-300 ease-out ${collapsed ? "rotate-180" : ""}`}
          >
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="mb-5.5 animate-fade-in-up">
        {!collapsed && (
          <div className="mb-3.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-text-inverse-muted">
            Upload Files
          </div>
        )}

        {!collapsed && !data && <UploadForm onSubmit={upload} isLoading={isLoading} />}

        {!collapsed && data && (
          <button
            type="button"
            onClick={reset}
            className="w-full rounded-md border border-border-dark px-3.5 py-2.5 text-xs font-semibold text-text-inverse transition-all duration-150 hover:border-accent hover:bg-bg-app-soft active:scale-[0.98]"
          >
            New Reconciliation
          </button>
        )}
      </div>

      {data && (
        <div className="mb-5.5">
          {!collapsed && (
            <div className="mb-3.5 text-[11px] font-bold uppercase tracking-wide text-text-inverse-muted">
              Results
            </div>
          )}

          <Tabs.List className="flex flex-col gap-0.5 animate-stagger">
            {RESULT_TABS.map((tab) => (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                title={tab.label}
                className={`group relative flex items-center gap-2.5 overflow-hidden rounded-md px-2.5 py-2 text-xs font-semibold text-text-inverse-muted transition-all duration-200 hover:translate-x-0.5 hover:bg-bg-app-soft hover:text-white data-[state=active]:bg-accent/20 data-[state=active]:text-[#5eead4] ${
                  collapsed ? "justify-center" : ""
                }`}
              >
                <span className="absolute left-0 top-0 h-full w-[3px] scale-y-0 bg-accent transition-transform duration-200 ease-out group-data-[state=active]:scale-y-100" />
                <span className="w-4 shrink-0 text-center">{tab.icon}</span>
                {!collapsed && <span className="whitespace-nowrap">{tab.label}</span>}
                {!collapsed && badgeCount[tab.value] > 0 && (
                  <span className="ml-auto rounded-full bg-warning px-1.5 py-0.5 text-[10px] font-bold text-white transition-transform duration-200 group-hover:scale-110">
                    {badgeCount[tab.value]}
                  </span>
                )}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </div>
      )}

      <div className="mt-auto pt-4 text-[11px] leading-relaxed text-text-inverse-muted">
        {!collapsed && (
          <>
            <p className="mb-2">Runs entirely on this machine — no data leaves your computer.</p>
            {user && (
              <button onClick={logout} className="font-semibold text-text-inverse hover:text-white">
                Log out ({user.username})
              </button>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
