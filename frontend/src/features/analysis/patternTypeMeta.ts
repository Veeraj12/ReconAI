import {
  Equal,
  Percent,
  CalendarClock,
  FileQuestion,
  Copy,
  RefreshCcw,
  Hash,
  Layers,
  Shuffle,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";
import type { BadgeTone } from "@/components/ui/StatusBadge";

interface PatternTypeMeta {
  label: string;
  icon: LucideIcon;
  tone: BadgeTone;
  description: string;
}

export const PATTERN_TYPE_META: Record<string, PatternTypeMeta> = {
  RECURRING_AMOUNT_DIFFERENCE: {
    label: "Fixed Amount Difference",
    icon: Equal,
    tone: "warning",
    description: "The same rupee-value difference recurs across many transactions.",
  },
  RECURRING_PERCENTAGE_DIFFERENCE: {
    label: "Percentage Difference",
    icon: Percent,
    tone: "warning",
    description: "A roughly constant percentage difference recurs across many transactions.",
  },
  DATE_OFFSET: {
    label: "Date Offset",
    icon: CalendarClock,
    tone: "info",
    description: "Bank and Tally dates consistently differ by the same number of days.",
  },
  MISSING_SOURCE: {
    label: "Missing Source",
    icon: FileQuestion,
    tone: "danger",
    description: "These transactions have no counterpart at all on the other side.",
  },
  DUPLICATE: {
    label: "Duplicate",
    icon: Copy,
    tone: "purple",
    description: "These look like the same transaction entered more than once.",
  },
  SIGN_REVERSAL: {
    label: "Sign Reversal",
    icon: RefreshCcw,
    tone: "accent",
    description: "Same amount and date, but opposite debit/credit direction.",
  },
  REFERENCE_MATCH_ONLY: {
    label: "Reference Pattern",
    icon: Hash,
    tone: "info",
    description: "References line up, but no consistent amount or date relationship.",
  },
  GROUPED_MATCH: {
    label: "Grouped Match",
    icon: Layers,
    tone: "success",
    description: "Several entries on one side sum to a single entry on the other.",
  },
  MIXED_ATTRIBUTE: {
    label: "Mixed Pattern",
    icon: Shuffle,
    tone: "neutral",
    description: "Multiple compounding factors — amount and timing both differ consistently.",
  },
  UNCLASSIFIED_RECURRING: {
    label: "Recurring (Unclassified)",
    icon: HelpCircle,
    tone: "neutral",
    description: "A recurring signature was found, but it doesn't fit a named pattern shape yet.",
  },
};

export function getPatternTypeMeta(patternType: string): PatternTypeMeta {
  return (
    PATTERN_TYPE_META[patternType] ?? {
      label: patternType.replace(/_/g, " "),
      icon: HelpCircle,
      tone: "neutral",
      description: "",
    }
  );
}

const CAUSE_CONFIDENCE_META: Record<string, { label: string; tone: BadgeTone }> = {
  high: { label: "High likelihood", tone: "success" },
  medium: { label: "Medium likelihood", tone: "warning" },
  low: { label: "Low likelihood", tone: "neutral" },
};

export function getCauseConfidenceMeta(level: string) {
  return CAUSE_CONFIDENCE_META[level] ?? { label: level, tone: "neutral" as BadgeTone };
}
