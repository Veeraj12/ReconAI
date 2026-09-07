"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";

import { usePagination } from "@/hooks/usePagination";

interface RawRowTableProps {
  rows?: Record<string, unknown>[] | null;
}

interface DroppedRowsPanelProps {
  bank?: Record<string, unknown>[] | null;
  tally?: Record<string, unknown>[] | null;
}

function formatCellValue(value: unknown): ReactNode {
  if (value === null || value === undefined) {
    return "—";
  }

  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  return String(value);
}

function RawRowTable({ rows }: RawRowTableProps) {
  // Runtime protection.
  // Even though TypeScript says this should always be an array,
  // the backend response can still contain null/undefined.
  const safeRows = Array.isArray(rows) ? rows : [];

  const {
    pageRows,
    rangeLabel,
    canGoPrev,
    canGoNext,
    goToPrevPage,
    goToNextPage,
  } = usePagination(safeRows);

  const columns = useMemo(() => {
    if (pageRows.length === 0) {
      return [];
    }

    const columnSet = new Set<string>();

    for (const row of pageRows) {
      Object.keys(row).forEach((key) => columnSet.add(key));
    }

    return Array.from(columnSet);
  }, [pageRows]);

  if (safeRows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center">
        <p className="text-sm text-muted-foreground">
          No dropped rows found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-max text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {columns.map((column) => (
                <th
                  key={column}
                  className="whitespace-nowrap px-4 py-3 text-left font-medium"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {pageRows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b last:border-b-0 hover:bg-muted/30"
              >
                {columns.map((column) => (
                  <td
                    key={column}
                    className="whitespace-nowrap px-4 py-3"
                  >
                    {formatCellValue(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {rangeLabel}
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={goToPrevPage}
            disabled={!canGoPrev}
            className="rounded-md border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <button
            type="button"
            onClick={goToNextPage}
            disabled={!canGoNext}
            className="rounded-md border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export function DroppedRowsPanel({
  bank,
  tally,
}: DroppedRowsPanelProps) {
  const safeBank = Array.isArray(bank) ? bank : [];
  const safeTally = Array.isArray(tally) ? tally : [];

  const [activeTab, setActiveTab] = useState<"bank" | "tally">("bank");

  const subTabs = [
    {
      value: "bank" as const,
      label: "Bank",
      count: safeBank.length,
    },
    {
      value: "tally" as const,
      label: "Tally",
      count: safeTally.length,
    },
  ];

  const activeRows = activeTab === "bank" ? safeBank : safeTally;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b">
        {subTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={[
              "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.value
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {tab.label}

            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <RawRowTable rows={activeRows} />
    </div>
  );
}