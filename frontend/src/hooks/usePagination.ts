"use client";

import { useMemo, useState } from "react";

const PAGE_SIZE = 200;

interface UsePaginationResult<T> {
  pageRows: T[];
  currentPage: number;
  totalPages: number;
  totalRows: number;
  rangeLabel: string;
  goToPrevPage: () => void;
  goToNextPage: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

/**
 * Unchanged from the original — reused as-is. Rendering every row into
 * the DOM at once caused the multi-second browser freeze at 100K+ rows,
 * so this keeps rendering one page of PAGE_SIZE rows at a time.
 */
export function usePagination<T>(rows: T[]): UsePaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(0);

  const totalRows = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));

  const safePage = Math.min(currentPage, totalPages - 1);

  const pageRows = useMemo(() => {
    const start = safePage * PAGE_SIZE;
    return rows.slice(start, start + PAGE_SIZE);
  }, [rows, safePage]);

  const start = safePage * PAGE_SIZE;
  const rangeLabel =
    totalRows === 0
      ? "No rows"
      : `Showing ${start + 1}-${Math.min(start + PAGE_SIZE, totalRows)} of ${totalRows}`;

  return {
    pageRows,
    currentPage: safePage,
    totalPages,
    totalRows,
    rangeLabel,
    goToPrevPage: () => setCurrentPage((p) => Math.max(0, p - 1)),
    goToNextPage: () => setCurrentPage((p) => Math.min(totalPages - 1, p + 1)),
    canGoPrev: safePage > 0,
    canGoNext: safePage < totalPages - 1,
  };
}
