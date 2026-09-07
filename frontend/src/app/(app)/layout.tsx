"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppToolbar } from "@/components/layout/AppToolbar";
import { ReconciliationProvider } from "@/features/reconciliation/ReconciliationProvider";
import { AnalysisProvider } from "@/features/analysis/AnalysisProvider";
import { ReconBotProvider } from "@/features/reconbot/ReconBotProvider";
import { ReconBotWidget } from "@/features/reconbot/components/ReconBotWidget";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReconciliationProvider>
      <AnalysisProvider>
        <ReconBotProvider>
          <Tabs.Root defaultValue="matched" className="flex h-screen overflow-hidden">
            <AppSidebar />
            <main className="flex min-w-0 flex-1 flex-col">
              <AppToolbar />
              <div className="flex-1 overflow-y-auto px-7 py-5">{children}</div>
            </main>
          </Tabs.Root>
          <ReconBotWidget />
        </ReconBotProvider>
      </AnalysisProvider>
    </ReconciliationProvider>
  );
}
