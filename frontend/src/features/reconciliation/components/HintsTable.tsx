"use client";

import { usePagination } from "@/hooks/usePagination";
import { Pager } from "@/components/ui/Pager";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Lightbulb } from "lucide-react";
import type { ExceptionPair } from "../types";

export function HintsTable({ hints }: { hints: ExceptionPair[] }) {
  const { pageRows, rangeLabel, canGoPrev, canGoNext, goToPrevPage, goToNextPage } =
    usePagination(hints);

  if (hints.length === 0) {
    return (
      <EmptyState
        icon={Lightbulb}
        title="No hints to show"
        description="Nothing close enough to a match was found to surface as a hint."
        tone="success"
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
            <th className="px-3 py-2.5 font-bold">Amount</th>
            <th className="px-3 py-2.5 font-bold">Bank Type</th>
            <th className="px-3 py-2.5 font-bold">Tally Type</th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map((hint, i) => (
            <tr
              key={i}
              className="border-b border-border-app/60 odd:bg-transparent even:bg-row-alt/50 transition-colors duration-100 hover:bg-row-hover"
            >
              <td className="px-3 py-2 tabular-data text-text-secondary">{hint.bankTransaction.date}</td>
              <td className="px-3 py-2 tabular-data text-text-secondary">{hint.bankTransaction.excelRow}</td>
              <td className="px-3 py-2 tabular-data text-text-secondary">{hint.tallyTransaction.excelRow}</td>
              <td className="px-3 py-2 tabular-data font-semibold text-text-primary">
                {hint.bankTransaction.amount}
              </td>
              <td className="px-3 py-2">
                {hint.bankTransaction.transactionType ? (
                  <StatusBadge tone="info">{hint.bankTransaction.transactionType}</StatusBadge>
                ) : (
                  <span className="text-text-secondary">-</span>
                )}
              </td>
              <td className="px-3 py-2">
                {hint.tallyTransaction.transactionType ? (
                  <StatusBadge tone="info">{hint.tallyTransaction.transactionType}</StatusBadge>
                ) : (
                  <span className="text-text-secondary">-</span>
                )}
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
