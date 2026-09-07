// Mirrors backend/parser/services/multiSourceReconciliationService.py's
// reconcile() return value exactly.

import type {
  ExceptionPair,
  GroupedMatch,
  MatchedPair,
  Transaction,
} from "../reconciliation/types";

export interface PerSourceSummary {
  matched: number;
  missing: number;
  matchPercentage: number;
  amountMismatches: number;
  typeMismatches: number;
  duplicates: number;
}

export interface MultiSourceSummary {
  totalPrimaryTransactions: number;
  fullyReconciled: number;
  partiallyReconciled: number;
  unreconciled: number;
  perSource: Record<string, PerSourceSummary>;
}

export interface CrossSourceBucket {
  problemSources: string[];
  label: string;
  count: number;
}

export interface SampleTransaction {
  excelRow: number;
  date: string | null;
  reference: string | null;
  amount: number | null;
  transactionType: string | null;
}

export interface PairwiseSummary {
  totalPrimaryTransactions: number;
  totalSecondaryTransactions: number;
  matchedTransactions: number;
  missingInSecondary: number;
  missingInPrimary: number;
  matchPercentage: number;
  referenceMatches: number;
  dateToleranceMatches: number;
  amountDateMatches: number;
  amountMismatches: number;
  typeMismatches: number;
  groupedMatches: number;
  signReversalHints: number;
  duplicatePrimary: number;
  duplicateSecondary: number;
  duplicateEntries: number;
  invalidPrimaryRows: number;
  invalidSecondaryRows: number;
  invalidPrimaryRowData: Record<string, unknown>[];
  invalidSecondaryRowData: Record<string, unknown>[];
}

export interface PairwiseResult {
  summary: PairwiseSummary;
  warnings: string[];
  matchedTransactions: MatchedPair[];
  missingInPrimary: Transaction[];
  missingInSecondary: Transaction[];
  exceptions: {
    amountMismatches: ExceptionPair[];
    typeMismatches: ExceptionPair[];
    groupedMatches: GroupedMatch[];
  };
  duplicates: {
    primary: Transaction[];
    secondary: Transaction[];
  };
  signReversalHints: ExceptionPair[];
}

export interface MultiSourceResult {
  success: true;
  primarySource: string;
  secondarySources: string[];
  secondarySourceErrors: Record<string, string>;
  summary: MultiSourceSummary;
  crossSourceBreakdown: CrossSourceBucket[];
  sampleTransactions: Record<string, SampleTransaction[]>;
  pairwiseResults: Record<string, PairwiseResult>;
}

export interface MultiSourceError {
  success: false;
  error: string;
}

export interface SecondarySourceInput {
  id: string; // client-side only, for React keys / add-remove
  label: string;
  file: File | null;
}
