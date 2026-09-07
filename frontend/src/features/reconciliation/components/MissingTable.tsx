"use client";

import { usePagination } from "@/hooks/usePagination";
import { Pager } from "@/components/ui/Pager";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { FileWarning } from "lucide-react";
import type { Transaction } from "../types";

export function MissingTable({
  transactions,
  rowLabel,
}: {
  transactions: Transaction[];
  rowLabel: string;
}) {
  const { pageRows, rangeLabel, canGoPrev, canGoNext, goToPrevPage, goToNextPage } =
    usePagination(transactions);

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={FileWarning}
        title="Nothing missing here"
        description="Every transaction on this side has a counterpart on the other side."
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
            <th className="px-3 py-2.5 font-bold">{rowLabel}</th>
            <th className="px-3 py-2.5 font-bold">Reference</th>
            <th className="px-3 py-2.5 font-bold">Amount</th>
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
              <td className="px-3 py-2 tabular-data font-semibold text-danger">
                <div className="flex items-center gap-2">
                  {t.amount}
                  {t.duplicateArtifact && (
                    <StatusBadge tone="neutral">
                      <span title={t.note}>duplicate copy</span>
                    </StatusBadge>
                  )}
                </div>
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
