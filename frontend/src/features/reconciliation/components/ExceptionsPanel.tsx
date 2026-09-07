"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { SubTabList } from "@/components/ui/SubTabs";
import type { ExceptionPair, GroupedMatch } from "../types";
import { AmountMismatchTable } from "./AmountMismatchTable";
import { TypeMismatchTable } from "./TypeMismatchTable";
import { GroupedMatchesTable } from "./GroupedMatchesTable";

interface ExceptionsPanelProps {
  amountMismatches: ExceptionPair[];
  typeMismatches: ExceptionPair[];
  groupedMatches: GroupedMatch[];
}

export function ExceptionsPanel({
  amountMismatches,
  typeMismatches,
  groupedMatches,
}: ExceptionsPanelProps) {
  const subTabs = [
    { value: "amount", label: "Amount Mismatches", count: amountMismatches.length },
    { value: "type", label: "Type Mismatches", count: typeMismatches.length },
    { value: "grouped", label: "Grouped Matches", count: groupedMatches.length },
  ];

  return (
    <Tabs.Root defaultValue="amount">
      <SubTabList tabs={subTabs} />

      <Tabs.Content value="amount">
        <p className="mb-3 text-xs text-text-secondary">
          Same reference on both sides, but the amount differs — check for partial payments,
          deductions, or entry typos.
        </p>
        <AmountMismatchTable pairs={amountMismatches} />
      </Tabs.Content>

      <Tabs.Content value="type">
        <p className="mb-3 text-xs text-text-secondary">
          Same reference and amount, but one side says Debit and the other Credit — usually a
          misclassification worth a second look.
        </p>
        <TypeMismatchTable pairs={typeMismatches} />
      </Tabs.Content>

      <Tabs.Content value="grouped">
        <p className="mb-3 text-xs text-text-secondary">
          Several entries on one side that together equal a single entry on the other side, same
          date — a likely split or consolidated transaction, not a genuine discrepancy. Shown here
          for confirmation rather than auto-matched, since it&apos;s a strong signal, not a
          certainty.
        </p>
        <GroupedMatchesTable groups={groupedMatches} />
      </Tabs.Content>
    </Tabs.Root>
  );
}
