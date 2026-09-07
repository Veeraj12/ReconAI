"use client";

import { createContext, useContext } from "react";
import { useReconBot } from "./useReconBot";

type ReconBotContextValue = ReturnType<typeof useReconBot>;

const ReconBotContext = createContext<ReconBotContextValue | null>(null);

export function ReconBotProvider({ children }: { children: React.ReactNode }) {
  const value = useReconBot();
  return <ReconBotContext.Provider value={value}>{children}</ReconBotContext.Provider>;
}

export function useReconBotContext() {
  const ctx = useContext(ReconBotContext);
  if (!ctx) {
    throw new Error("useReconBotContext must be used within a ReconBotProvider");
  }
  return ctx;
}
