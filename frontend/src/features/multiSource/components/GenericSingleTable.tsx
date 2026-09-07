"use client";

import { usePagination } from "@/hooks/usePagination";
import { Pager } from "@/components/ui/Pager";
import { EmptyState } from "@/components/ui/EmptyState";
import { FileWarning, type LucideIcon } from "lucide-react";
import type { Transaction } from "../../reconciliation/types";

interface GenericSingleTableProps {
  rows: Transaction[];
  rowLabel: string;
  emptyIcon?: LucideIcon;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function GenericSingleTable({
  rows,
  rowLabel,
  emptyIcon = FileWarning,
  emptyTitle = "Nothing here",
  emptyDescription = "No records in this category.",
}: GenericSingleTableProps) {
  const { pageRows, rangeLabel, canGoPrev, canGoNext, goToPrevPage, goToNextPage } = usePagination(rows);

  if (rows.length === 0) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} tone="success" />;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border-app">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border-app bg-row-alt text-left uppercase tracking-wide text-text-secondary">
            <th className="px-3 py-2.5 font-bold">Date</th>
            <th className="px-3 py-2.5 font-bold">{rowLabel}</th>
            <th className="px-3 py-2.5 font-bold">Reference</th>
            <th className="px-3 py-2.5 font-bold">Amount</th>
            <th className="px-3 py-2.5 font-bold">Type</th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map((t, i) => (
            <tr
              key={`${t.excelRow}-${i}`}
              className="border-b border-border-app/60 odd:bg-transparent even:bg-row-alt/50 hover:bg-row-hover"
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
      <Pager rangeLabel={rangeLabel} canGoPrev={canGoPrev} canGoNext={canGoNext} onPrev={goToPrevPage} onNext={goToNextPage} />
    </div>
  );
}
