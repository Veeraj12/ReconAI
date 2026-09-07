import * as Tabs from "@radix-ui/react-tabs";

export interface SubTabDef {
  value: string;
  label: string;
  count: number;
}

export function SubTabList({ tabs }: { tabs: SubTabDef[] }) {
  return (
    <Tabs.List className="mb-4 inline-flex gap-1 rounded-lg border border-border-app bg-row-alt p-1">
      {tabs.map((tab) => (
        <Tabs.Trigger
          key={tab.value}
          value={tab.value}
          className="group flex min-h-9 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-text-secondary outline-none transition-all duration-180 hover:text-text-primary active:scale-95 data-[state=active]:scale-100 data-[state=active]:bg-accent data-[state=active]:text-white data-[state=active]:shadow-sm focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          {tab.label}
          <span className="tabular-data rounded-full bg-black/10 px-1.5 text-[10px] font-bold group-data-[state=active]:bg-white/25">
            {tab.count}
          </span>
        </Tabs.Trigger>
      ))}
    </Tabs.List>
  );
}
