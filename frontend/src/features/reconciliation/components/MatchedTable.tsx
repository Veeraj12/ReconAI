"use client";

import { usePagination } from "@/hooks/usePagination";
import { Pager } from "@/components/ui/Pager";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { CheckCircle2 } from "lucide-react";
import type { MatchedPair } from "../types";

const RULE_LABELS: Record<string, string> = {
  REFERENCE: "Reference",
  REFERENCE_DATE_TOLERANCE: "Reference (Date Tolerance)",
  AMOUNT_DATE: "Amount / Date",
};

export function MatchedTable({ matches }: { matches: MatchedPair[] }) {
  const { pageRows, rangeLabel, canGoPrev, canGoNext, goToPrevPage, goToNextPage } =
    usePagination(matches);

  if (matches.length === 0) {
    return (
      <EmptyState
        icon={CheckCircle2}
        title="No matches yet"
        description="Run a reconciliation to see matched bank and tally transactions here."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border-app">
      <table className="w-full text-xs">
        <thead>
          <tr className="sticky top-0 z-10 border-b border-border-app bg-row-alt text-left uppercase tracking-wide text-text-secondary">
            <th className="px-3 py-2.5 font-bold">Date</th>
            <th className="px-3 py-2.5 font-bold">Bank Row</th>
            <th className="px-3 py-2.5 font-bold">Tally Row</th>
            <th className="px-3 py-2.5 font-bold">Reference</th>
            <th className="px-3 py-2.5 font-bold">Amount</th>
            <th className="px-3 py-2.5 font-bold">Rule</th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map((match, i) => (
            <tr
              key={`${match.bankTransaction.excelRow}-${i}`}
              className="border-b border-border-app/60 odd:bg-transparent even:bg-row-alt/50 transition-colors duration-100 hover:bg-row-hover"
            >
              <td className="px-3 py-2 tabular-data text-text-secondary">{match.bankTransaction.date}</td>
              <td className="px-3 py-2 tabular-data text-text-secondary">{match.bankTransaction.excelRow}</td>
              <td className="px-3 py-2 tabular-data text-text-secondary">{match.tallyTransaction.excelRow}</td>
              <td className="px-3 py-2 font-medium text-text-primary">{match.bankTransaction.reference}</td>
              <td className="px-3 py-2 tabular-data font-semibold text-text-primary">
                {match.bankTransaction.amount}
              </td>
              <td className="px-3 py-2">
                <StatusBadge tone="success" stamped>
                  {RULE_LABELS[match.matchingRule] ?? match.matchingRule}
                </StatusBadge>
              </td>
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
  );
}
