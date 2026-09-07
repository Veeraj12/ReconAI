"use client";

import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { PieChart } from "lucide-react";
import { ChartCard } from "@/components/ui/ChartCard";
import type { ReconciliationSummary } from "../types";

ChartJS.register(ArcElement, Tooltip);

const SEGMENTS = [
  { key: "matchedTransactions" as const, label: "Matched", color: "#0d9488" },
  { key: "missingInBank" as const, label: "Missing In Bank", color: "#dc2626" },
  { key: "missingInTally" as const, label: "Missing In Tally", color: "#d97706" },
];

export function SummaryChart({ summary }: { summary: ReconciliationSummary }) {
  const total = SEGMENTS.reduce((sum, seg) => sum + summary[seg.key], 0) || 1;
  const matchPct = Math.round((summary.matchedTransactions / total) * 100);

  const data = {
    labels: SEGMENTS.map((s) => s.label),
    datasets: [
      {
        data: SEGMENTS.map((s) => summary[s.key]),
        backgroundColor: SEGMENTS.map((s) => s.color),
        borderWidth: 0,
        borderRadius: 6,
        spacing: 2,
        hoverOffset: 6,
      },
    ],
  };

  return (
    <ChartCard
      icon={PieChart}
      title="Reconciliation Summary"
      subtitle="Matched vs. outstanding transactions"
      legend={
        <ul className="space-y-2">
          {SEGMENTS.map((seg) => {
            const count = summary[seg.key];
            const pct = Math.round((count / total) * 100);
            return (
              <li key={seg.key} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-text-primary">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: seg.color }}
                  />
                  {seg.label}
                </span>
                <span className="tabular-data text-text-secondary">
                  {count.toLocaleString()}{" "}
                  <span className="text-text-secondary/70">({pct}%)</span>
                </span>
              </li>
            );
          })}
        </ul>
      }
    >
      <div className="relative mx-auto aspect-square max-w-[220px]">
        <Doughnut
          data={data}
          options={{
            responsive: true,
            cutout: "72%",
            animation: { animateRotate: true, duration: 700, easing: "easeOutQuart" },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: "#2b241f",
                padding: 10,
                cornerRadius: 8,
                titleFont: { size: 12, weight: "bold" },
                bodyFont: { size: 12 },
              },
            },
          }}
        />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display tabular-data text-3xl font-semibold text-text-primary">
            {matchPct}%
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
            Matched
          </span>
        </div>
      </div>
    </ChartCard>
  );
}
