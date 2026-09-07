"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { Cloud } from "lucide-react";
import { useReconciliationContext } from "@/features/reconciliation/ReconciliationProvider";
import { computeStatistics } from "@/features/reconciliation/computeStatistics";
import { SummaryCards } from "@/features/reconciliation/components/SummaryCards";
import { SummaryChart } from "@/features/reconciliation/components/SummaryChart";
import { MatchRuleChart } from "@/features/reconciliation/components/MatchRuleChart";
import { MatchedTable } from "@/features/reconciliation/components/MatchedTable";
import { MissingTable } from "@/features/reconciliation/components/MissingTable";
import { ExceptionsPanel } from "@/features/reconciliation/components/ExceptionsPanel";
import { DroppedRowsPanel } from "@/features/reconciliation/components/DroppedRowsPanel";
import { DuplicatesPanel } from "@/features/reconciliation/components/DuplicatesPanel";
import { HintsTable } from "@/features/reconciliation/components/HintsTable";
import { PatternsPanel } from "@/features/analysis/components/PatternsPanel";
import { ExportPanel } from "@/features/export/ExportPanel";
import { EmptyState } from "@/components/layout/EmptyState";
import { SkeletonMetricCards } from "@/components/ui/Skeleton";

export default function ReconcilePage() {
  const { data, error, isRestoring, wasRestored } = useReconciliationContext();

  // Checking the server for a previously-saved session — a brief,
  // deliberate pause before showing the empty upload state, so a
  // returning user doesn't see the "upload a file" prompt flash for a
  // moment before their actual saved result appears underneath it.
  if (isRestoring) {
    return <SkeletonMetricCards />;
  }

  if (!data) {
    return (
      <>
        {error && (
          <p className="mb-4 animate-scale-in rounded-md bg-danger/10 px-3.5 py-2.5 text-xs font-medium text-danger">
            {error}
          </p>
        )}
        <EmptyState />
      </>
    );
  }

  const stats = computeStatistics(data.summary);

  return (
    <div className="space-y-4">
      {wasRestored && (
        <div className="flex animate-scale-in items-center gap-2 rounded-md border border-success/25 bg-success-soft px-3.5 py-2.5 text-xs font-medium text-success">
          <Cloud className="h-4 w-4 shrink-0" />
          Restored your last reconciliation — this result is saved automatically, so a refresh or
          connection drop never loses your work.
        </div>
      )}

      <SummaryCards summary={data.summary} stats={stats} />

      <div className="grid grid-cols-1 gap-4 animate-stagger lg:grid-cols-2">
        <SummaryChart summary={data.summary} />
        <MatchRuleChart stats={stats} />
      </div>

      <Tabs.Content value="matched">
        <MatchedTable matches={data.matchedTransactions} />
      </Tabs.Content>

      <Tabs.Content value="missingBank">
        <MissingTable transactions={data.missingInBank} rowLabel="Tally Row" />
      </Tabs.Content>

      <Tabs.Content value="missingTally">
        <MissingTable transactions={data.missingInTally} rowLabel="Bank Row" />
      </Tabs.Content>

      <Tabs.Content value="exceptions">
        <ExceptionsPanel
          amountMismatches={data.exceptions.amountMismatches}
          typeMismatches={data.exceptions.typeMismatches}
          groupedMatches={data.exceptions.groupedMatches}
        />
      </Tabs.Content>

      <Tabs.Content value="analysis">
        <PatternsPanel />
      </Tabs.Content>

      <Tabs.Content value="droppedRows">
        <DroppedRowsPanel bank={data.invalidBankRowData} tally={data.invalidTallyRowData} />
      </Tabs.Content>

      <Tabs.Content value="duplicates">
        <DuplicatesPanel bank={data.duplicates.bank} tally={data.duplicates.tally} />
      </Tabs.Content>

      <Tabs.Content value="hints">
        <HintsTable hints={data.signReversalHints} />
      </Tabs.Content>

      <Tabs.Content value="export">
        <ExportPanel data={data} />
      </Tabs.Content>
    </div>
  );
}
