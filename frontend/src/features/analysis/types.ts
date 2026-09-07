// Mirrors the actual JSON returned by the backend — see
// backend/parser/analytics/patterns.py (Pattern.to_dict) and
// backend/parser/analytics/explanation/schema.py (PatternExplanation.to_dict).
// Field casing is exactly what the API sends (snake_case for the nested
// pattern/explanation objects, camelCase at the top level) rather than
// normalized on this side, so this stays a truthful contract.

export type PatternType =
  | "RECURRING_AMOUNT_DIFFERENCE"
  | "RECURRING_PERCENTAGE_DIFFERENCE"
  | "DATE_OFFSET"
  | "MISSING_SOURCE"
  | "DUPLICATE"
  | "SIGN_REVERSAL"
  | "REFERENCE_MATCH_ONLY"
  | "GROUPED_MATCH"
  | "MIXED_ATTRIBUTE"
  | "UNCLASSIFIED_RECURRING";

export type ExceptionType =
  | "AMOUNT_MISMATCH"
  | "TYPE_MISMATCH"
  | "GROUPED_MATCH"
  | "MISSING_IN_TALLY"
  | "MISSING_IN_BANK"
  | "DUPLICATE_BANK"
  | "DUPLICATE_TALLY"
  | "SIGN_REVERSAL_HINT";

export interface PatternCommonFeatures {
  reference_match_rate?: number | null;
  amount_match_rate?: number | null;
  date_match_rate?: number | null;
  average_absolute_amount_difference?: number | null;
  median_absolute_amount_difference?: number | null;
  average_percentage_difference?: number | null;
  common_date_offset_days?: number | null;
  [key: string]: number | null | undefined;
}

export interface Pattern {
  pattern_id: string;
  pattern_type: PatternType | string;
  exception_type: ExceptionType | string;
  record_count: number;
  total_financial_impact: number;
  common_features: PatternCommonFeatures;
  exception_ids: string[];
  confidence: number;
  frequency_score: number;
  impact_score: number;
  combined_score: number;
  summary: string;
}

export interface PatternAnalysisResult {
  totalExceptions: number;
  patternsFound: number;
  patterns: Pattern[];
  outliers: number;
  outlierExceptionIds: string[];
}

export interface AnalyzeExceptionsResponse extends PatternAnalysisResult {
  success: true;
}

// ---- Phase 3: explanation ----

export type ConfidenceLevel = "high" | "medium" | "low";
export type ExplanationStatus = "deterministic_local";

export interface PossibleCause {
  cause: string;
  cause_id: string;
  confidence_level: ConfidenceLevel;
  supporting_evidence: string[];
  contradicting_evidence: string[];
}

export interface EvidenceReference {
  claim: string;
  feature: string;
  grounded: boolean;
}

export interface PatternExplanation {
  pattern_id: string;
  summary: string;
  facts: string[];
  possible_causes: PossibleCause[];
  unknowns: string[];
  recommended_investigation: string;
  evidence_references: EvidenceReference[];
  pattern_confidence: number;
  confidence_methodology: string;
  status: ExplanationStatus;
  model: string | null;
  generated_at: string | null;
  validation_warnings: string[];
  from_cache: boolean;
}

export interface ExplainPatternResponse {
  success: true;
  pattern: Pattern;
  explanation: PatternExplanation | null;
  error?: string;
}

// The payload both /exceptions/analyze/ and /exceptions/patterns/<id>/explain/
// accept — exactly the exception-shaped slice of ReconciliationResult.
export interface ExceptionAnalysisPayload {
  exceptions: {
    amountMismatches: unknown[];
    typeMismatches: unknown[];
    groupedMatches: unknown[];
  };
  missingInBank: unknown[];
  missingInTally: unknown[];
  duplicates: {
    bank: unknown[];
    tally: unknown[];
  };
  signReversalHints: unknown[];
}
