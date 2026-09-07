"use client";

import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { SubTabList } from "@/components/ui/SubTabs";
import { GenericPairTable } from "./GenericPairTable";
import { GenericSingleTable } from "./GenericSingleTable";
import type { MultiSourceResult } from "../types";

export function SourceDrilldown({ result }: { result: MultiSourceResult }) {
  const sourceNames = Object.keys(result.pairwiseResults);
  const [activeSource, setActiveSource] = useState(sourceNames[0]);

  if (sourceNames.length === 0) return null;
  const pairwise = result.pairwiseResults[activeSource];
  const primaryLabel = result.primarySource;

  const subTabs = [
    { value: "matched", label: "Matched", count: pairwise.matchedTransactions.length },
    { value: "missingSecondary", label: `Missing in ${activeSource}`, count: pairwise.missingInPrimary.length },
    { value: "missingPrimary", label: `Missing in ${primaryLabel}`, count: pairwise.missingInSecondary.length },
    { value: "amountMismatches", label: "Amount Mismatches", count: pairwise.exceptions.amountMismatches.length },
    { value: "typeMismatches", label: "Type Mismatches", count: pairwise.exceptions.typeMismatches.length },
    { value: "signReversal", label: "Sign Reversal", count: pairwise.signReversalHints.length },
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-display text-sm font-semibold text-text-primary">Per-Source Detail</h3>

      <div className="flex flex-wrap gap-1.5">
        {sourceNames.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setActiveSource(name)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
              activeSource === name
                ? "bg-accent text-white shadow-sm"
                : "border border-border-app text-text-secondary hover:text-text-primary"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <Tabs.Root defaultValue="matched" key={activeSource}>
        <SubTabList tabs={subTabs} />

        <Tabs.Content value="matched">
          <GenericPairTable
            pairs={pairwise.matchedTransactions}
            primaryLabel={primaryLabel}
            secondaryLabel={activeSource}
            emptyTitle="No matches"
            emptyDescription={`Nothing matched between ${primaryLabel} and ${activeSource}.`}
          />
        </Tabs.Content>

        <Tabs.Content value="missingSecondary">
          <GenericSingleTable
            rows={pairwise.missingInPrimary}
            rowLabel={`${primaryLabel} Row`}
            emptyTitle="Nothing missing"
            emptyDescription={`Every ${primaryLabel} transaction has a counterpart in ${activeSource}.`}
          />
        </Tabs.Content>

        <Tabs.Content value="missingPrimary">
          <GenericSingleTable
            rows={pairwise.missingInSecondary}
            rowLabel={`${activeSource} Row`}
            emptyTitle="Nothing missing"
            emptyDescription={`Every ${activeSource} transaction has a counterpart in ${primaryLabel}.`}
          />
        </Tabs.Content>

        <Tabs.Content value="amountMismatches">
          <GenericPairTable
            pairs={pairwise.exceptions.amountMismatches}
            primaryLabel={primaryLabel}
            secondaryLabel={activeSource}
            showDifference
            emptyTitle="No amount mismatches"
            emptyDescription="Every matched reference has an identical amount on both sides."
          />
        </Tabs.Content>

        <Tabs.Content value="typeMismatches">
          <GenericPairTable
            pairs={pairwise.exceptions.typeMismatches}
            primaryLabel={primaryLabel}
            secondaryLabel={activeSource}
            emptyTitle="No type mismatches"
            emptyDescription="No matched reference has a conflicting debit/credit type."
          />
        </Tabs.Content>

        <Tabs.Content value="signReversal">
          <GenericPairTable
            pairs={pairwise.signReversalHints}
            primaryLabel={primaryLabel}
            secondaryLabel={activeSource}
            emptyTitle="No sign reversal hints"
            emptyDescription="No same-amount, same-date, opposite-type pairs were found."
          />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
