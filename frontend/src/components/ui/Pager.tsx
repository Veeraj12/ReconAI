import { ChevronLeft, ChevronRight } from "lucide-react";

interface PagerProps {
  rangeLabel: string;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function Pager({ rangeLabel, canGoPrev, canGoNext, onPrev, onNext }: PagerProps) {
  return (
    <div className="flex items-center justify-between border-t border-border-app bg-row-alt px-3 py-2 text-xs text-text-secondary">
      <span className="tabular-data">{rangeLabel}</span>
      <div className="flex gap-1.5">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canGoPrev}
          className="flex items-center gap-1 rounded-md border border-border-app bg-bg-panel px-2.5 py-1.5 text-xs font-medium text-text-primary transition-all duration-150 hover:border-accent hover:text-accent-dark active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Previous
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className="flex items-center gap-1 rounded-md border border-border-app bg-bg-panel px-2.5 py-1.5 text-xs font-medium text-text-primary transition-all duration-150 hover:border-accent hover:text-accent-dark active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
