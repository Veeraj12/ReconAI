"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { useMemo } from "react";
import { usePagination } from "@/hooks/usePagination";
import { Pager } from "@/components/ui/Pager";
import { SubTabList } from "@/components/ui/SubTabs";
import { EmptyState } from "@/components/ui/EmptyState";
import { Copy } from "lucide-react";
import type { Transaction } from "../types";

/** The rows array contains every row involved in a duplicate group
 * (a pair of identical rows contributes 2 entries), which is the right
 * thing to show in the table below — a reviewer needs to see both
 * copies side by side. But "how many duplicates do I have" should
 * mean incidents, not row count: a pair of 2 identical rows is ONE
 * duplicate, not two. This mirrors exactly how the backend's own
 * summary.duplicateBank/duplicateTally are computed (group size - 1,
 * summed) — see ReconciliationService._find_duplicates' docstring. */
function countDuplicateIncidents(rows: Transaction[]): number {
  const groups = new Map<string, number>();
  for (const t of rows) {
    const key = `${t.reference}|${t.amount}|${t.date}|${t.transactionType ?? ""}`;
    groups.set(key, (groups.get(key) ?? 0) + 1);
  }
  let incidents = 0;
  for (const size of groups.values()) {
    incidents += Math.max(0, size - 1);
  }
  return incidents;
}

function DuplicateTable({ rows }: { rows: Transaction[] }) {
  const { pageRows, rangeLabel, canGoPrev, canGoNext, goToPrevPage, goToNextPage } =
    usePagination(rows);
  const incidents = useMemo(() => countDuplicateIncidents(rows), [rows]);

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={Copy}
        title="No duplicates found"
        description="No rows in this file share an identical reference, amount, date, and type."
        tone="success"
      />
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-text-secondary">
        <span className="tabular-data font-semibold text-text-primary">{incidents.toLocaleString()}</span>{" "}
        duplicate incident{incidents === 1 ? "" : "s"} — {rows.length.toLocaleString()} rows shown below
        (each incident appears as {rows.length === incidents ? "1 row" : "a group of matching rows"}, so you
        can compare the copies side by side).
      </p>
      <div className="overflow-hidden rounded-lg border border-border-app">
        <table className="w-full text-xs">
          <thead>
            <tr className="sticky top-0 z-10 border-b border-border-app bg-row-alt text-left uppercase tracking-wide text-text-secondary">
              <th className="px-3 py-2.5 font-bold">Date</th>
              <th className="px-3 py-2.5 font-bold">Row</th>
              <th className="px-3 py-2.5 font-bold">Reference</th>
              <th className="px-3 py-2.5 font-bold">Amount</th>
              <th className="px-3 py-2.5 font-bold">Type</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((t, i) => (
              <tr
                key={`${t.excelRow}-${i}`}
                className="border-b border-border-app/60 odd:bg-transparent even:bg-row-alt/50 transition-colors duration-100 hover:bg-row-hover"
              >
                <td className="px-3 py-2 tabular-data text-text-secondary">{t.date}</td>
                <td className="px-3 py-2 tabular-data text-text-secondary">{t.excelRow}</td>
                <td className="px-3 py-2 font-medium text-text-primary">{t.reference}</td>
                <td className="px-3 py-2 tabular-data text-text-primary">{t.amount}</td>
                <td className="px-3 py-2 text-text-secondary">{t.transactionType ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pager
          rangeLabel={rangeLabel}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
          onPrev={goToPrevPage}
          onNext={goToNextPage}
        />
      </div>
    </div>
  );
}

export function DuplicatesPanel({ bank, tally }: { bank: Transaction[]; tally: Transaction[] }) {
  const bankIncidents = useMemo(() => countDuplicateIncidents(bank), [bank]);
  const tallyIncidents = useMemo(() => countDuplicateIncidents(tally), [tally]);

  const subTabs = [
    { value: "bank", label: "Duplicate Bank Entries", count: bankIncidents },
    { value: "tally", label: "Duplicate Tally Entries", count: tallyIncidents },
  ];

  return (
    <Tabs.Root defaultValue="bank">
      <SubTabList tabs={subTabs} />

      <Tabs.Content value="bank">
        <p className="mb-3 text-xs text-text-secondary">
          Rows within the bank file that share identical reference, amount, date, and type —
          possible double entry.
        </p>
        <DuplicateTable rows={bank} />
      </Tabs.Content>

      <Tabs.Content value="tally">
        <p className="mb-3 text-xs text-text-secondary">
          Rows within the tally file that share identical reference, amount, date, and type —
          possible double entry.
        </p>
        <DuplicateTable rows={tally} />
      </Tabs.Content>
    </Tabs.Root>
  );
}
