import { forwardRef, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

interface WorkspaceSectionProps {
  id: string;
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  count?: number;
  tone?: "accent" | "success" | "danger" | "warning" | "purple" | "neutral";
  children: ReactNode;
}

/**
 * forwardRef so the sidebar's useScrollSpy hook can register each
 * section's DOM node and scrollIntoView on nav click, without ever
 * reaching for document.querySelector.
 */
export const WorkspaceSection = forwardRef<HTMLElement, WorkspaceSectionProps>(
  ({ id, icon, title, subtitle, count, tone, children }, ref) => {
    return (
      <section
        ref={ref}
        id={id}
        data-workspace-section={id}
        className="scroll-mt-[calc(var(--toolbar-height)+16px)] rounded-xl border border-border-app bg-bg-panel p-5 shadow-sm"
      >
        <SectionHeader icon={icon} title={title} subtitle={subtitle} count={count} tone={tone} />
        {children}
      </section>
    );
  }
);

WorkspaceSection.displayName = "WorkspaceSection";
