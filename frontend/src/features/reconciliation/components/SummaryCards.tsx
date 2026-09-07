import { Landmark, BookOpenCheck, CheckCircle2, Scale, Percent } from "lucide-react";
import { MetricCard, type MetricTone } from "@/components/ui/MetricCard";
import type { ReconciliationSummary } from "../types";
import type { DerivedStatistics } from "../computeStatistics";

export function SummaryCards({
  summary,
  stats,
}: {
  summary: ReconciliationSummary;
  stats: DerivedStatistics;
}) {
  const cards: {
    icon: typeof Landmark;
    label: string;
    value: string | number;
    subtitle: string;
    tone: MetricTone;
  }[] = [
    {
      icon: Landmark,
      label: "Bank Transactions",
      value: summary.totalBankTransactions.toLocaleString(),
      subtitle: "Rows parsed from bank statement",
      tone: "neutral",
    },
    {
      icon: BookOpenCheck,
      label: "Tally Transactions",
      value: summary.totalTallyTransactions.toLocaleString(),
      subtitle: "Rows parsed from tally export",
      tone: "neutral",
    },
    {
      icon: CheckCircle2,
      label: "Matched",
      value: summary.matchedTransactions.toLocaleString(),
      subtitle: "Reconciled successfully",
      tone: "success",
    },
    {
      icon: Scale,
      label: "Mismatches",
      value: stats.totalMismatch.toLocaleString(),
      subtitle: "Need review",
      tone: "danger",
    },
    {
      icon: Percent,
      label: "Match Rate",
      value: `${summary.matchPercentage}%`,
      subtitle: "Of total transactions",
      tone: "accent",
    },
  ];

  return (
    <div className="animate-stagger grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => (
        <MetricCard
          key={card.label}
          icon={card.icon}
          label={card.label}
          value={card.value}
          subtitle={card.subtitle}
          tone={card.tone}
        />
      ))}
    </div>
  );
}
