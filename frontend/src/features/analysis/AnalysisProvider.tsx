"use client";

import { createContext, useContext } from "react";
import { useAnalysis } from "./useAnalysis";

type AnalysisContextValue = ReturnType<typeof useAnalysis>;

const AnalysisContext = createContext<AnalysisContextValue | null>(null);

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const value = useAnalysis();
  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
}

export function useAnalysisContext() {
  const ctx = useContext(AnalysisContext);
  if (!ctx) {
    throw new Error("useAnalysisContext must be used within an AnalysisProvider");
  }
  return ctx;
}
