export type MatchingRule = "REFERENCE" | "REFERENCE_DATE_TOLERANCE" | "AMOUNT_DATE";
export type TransactionType = "DEBIT" | "CREDIT" | null;

export interface Transaction {
  date: string;
  reference: string;
  description: string;
  amount: number;
  transactionType: TransactionType;
  excelRow: number;
  duplicateArtifact?: boolean;
  note?: string;
}

export interface MatchedPair {
  bankTransaction: Transaction;
  tallyTransaction: Transaction;
  matchingRule: MatchingRule;
  dateDifferenceDays: number;
  withinTolerance: boolean;
}

export interface ExceptionPair {
  bankTransaction: Transaction;
  tallyTransaction: Transaction;
  reason: string;
  amountDifference?: number;
}

export type GroupDirection = "TALLY_MANY_TO_BANK_ONE" | "BANK_MANY_TO_TALLY_ONE";

export interface GroupedMatch {
  direction: GroupDirection;
  date: string;
  oneTransaction: Transaction;
  manyTransactions: Transaction[];
  amount: number;
  reason: string;
}

export interface ReconciliationSummary {
  totalBankTransactions: number;
  totalTallyTransactions: number;
  matchedTransactions: number;
  missingInBank: number;
  missingInTally: number;
  matchPercentage: number;
  referenceMatches: number;
  dateToleranceMatches: number;
  amountDateMatches: number;
  amountMismatches: number;
  typeMismatches: number;
  groupedMatches: number;
  signReversalHints: number;
  duplicateBank: number;
  duplicateTally: number;
  duplicateEntries: number;
  invalidBankRows: number;
  invalidTallyRows: number;
}

export interface ReconciliationResult {
  success: true;
  warnings: string[];
  summary: ReconciliationSummary;
  matchedTransactions: MatchedPair[];
  missingInBank: Transaction[];
  missingInTally: Transaction[];
  exceptions: {
    amountMismatches: ExceptionPair[];
    typeMismatches: ExceptionPair[];
    groupedMatches: GroupedMatch[];
  };
  duplicates: {
    bank: Transaction[];
    tally: Transaction[];
  };
  signReversalHints: ExceptionPair[];
  invalidBankRowData: Record<string, unknown>[];
  invalidTallyRowData: Record<string, unknown>[];
}

export interface ReconciliationError {
  success: false;
  error: string;
}
