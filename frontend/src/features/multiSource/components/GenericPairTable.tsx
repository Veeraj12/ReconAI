"use client";

import { usePagination } from "@/hooks/usePagination";
import { Pager } from "@/components/ui/Pager";
import { EmptyState } from "@/components/ui/EmptyState";
import { CheckCircle2, type LucideIcon } from "lucide-react";
import type { ExceptionPair, MatchedPair, Transaction } from "../../reconciliation/types";

interface GenericPairTableProps {
  pairs: (MatchedPair | ExceptionPair)[];
  primaryLabel: string;
  secondaryLabel: string;
  showDifference?: boolean;
  emptyIcon?: LucideIcon;
  emptyTitle?: string;
  emptyDescription?: string;
}

function primaryOf(pair: MatchedPair | ExceptionPair): Transaction {
  return pair.bankTransaction;
}
function secondaryOf(pair: MatchedPair | ExceptionPair): Transaction {
  return pair.tallyTransaction;
}

export function GenericPairTable({
  pairs,
  primaryLabel,
  secondaryLabel,
  showDifference = false,
  emptyIcon = CheckCircle2,
  emptyTitle = "Nothing here",
  emptyDescription = "No records in this category.",
}: GenericPairTableProps) {
  const { pageRows, rangeLabel, canGoPrev, canGoNext, goToPrevPage, goToNextPage } = usePagination(pairs);

  if (pairs.length === 0) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} tone="success" />;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border-app">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border-app bg-row-alt text-left uppercase tracking-wide text-text-secondary">
            <th className="px-3 py-2.5 font-bold">Date</th>
            <th className="px-3 py-2.5 font-bold">{primaryLabel} Row</th>
            <th className="px-3 py-2.5 font-bold">{secondaryLabel} Row</th>
            <th className="px-3 py-2.5 font-bold">Reference</th>
            <th className="px-3 py-2.5 font-bold">{primaryLabel} Amount</th>
            <th className="px-3 py-2.5 font-bold">{secondaryLabel} Amount</th>
            {showDifference && <th className="px-3 py-2.5 font-bold">Difference</th>}
          </tr>
        </thead>
        <tbody>
          {pageRows.map((pair, i) => {
            const p = primaryOf(pair);
            const s = secondaryOf(pair);
            const diff = "amountDifference" in pair ? pair.amountDifference : p.amount - s.amount;
            return (
              <tr
                key={`${p.excelRow}-${s.excelRow}-${i}`}
                className="border-b border-border-app/60 odd:bg-transparent even:bg-row-alt/50 hover:bg-row-hover"
              >
                <td className="px-3 py-2 tabular-data text-text-secondary">{p.date}</td>
                <td className="px-3 py-2 tabular-data text-text-secondary">{p.excelRow}</td>
                <td className="px-3 py-2 tabular-data text-text-secondary">{s.excelRow}</td>
                <td className="px-3 py-2 font-medium text-text-primary">{p.reference || s.reference}</td>
                <td className="px-3 py-2 tabular-data text-text-primary">{p.amount}</td>
                <td className="px-3 py-2 tabular-data text-text-primary">{s.amount}</td>
                {showDifference && (
                  <td className="px-3 py-2 tabular-data font-bold text-danger">
                    {diff !== undefined ? diff : "—"}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pager rangeLabel={rangeLabel} canGoPrev={canGoPrev} canGoNext={canGoNext} onPrev={goToPrevPage} onNext={goToNextPage} />
    </div>
  );
}
