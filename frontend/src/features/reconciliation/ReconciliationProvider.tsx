"use client";

import { createContext, useContext } from "react";
import { useReconciliation } from "./useReconciliation";

type ReconciliationContextValue = ReturnType<typeof useReconciliation>;

const ReconciliationContext = createContext<ReconciliationContextValue | null>(null);

export function ReconciliationProvider({ children }: { children: React.ReactNode }) {
  const value = useReconciliation();
  return (
    <ReconciliationContext.Provider value={value}>{children}</ReconciliationContext.Provider>
  );
}

export function useReconciliationContext() {
  const ctx = useContext(ReconciliationContext);
  if (!ctx) {
    throw new Error("useReconciliationContext must be used within a ReconciliationProvider");
  }
  return ctx;
}
