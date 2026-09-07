"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseScrollSpyResult {
  activeId: string;
  registerSection: (id: string) => (node: HTMLElement | null) => void;
  scrollToSection: (id: string) => void;
}

/**
 * Tracks which registered section is currently in view (via
 * IntersectionObserver against real refs, never document.querySelector)
 * and provides a scrollToSection helper that smooth-scrolls using the
 * same stored ref, so the sidebar and the workspace stay in sync.
 */
export function useScrollSpy(sectionIds: string[]): UseScrollSpyResult {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "");
  const nodesRef = useRef<Map<string, HTMLElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const suppressUntil = useRef(0);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (Date.now() < suppressUntil.current) return;

        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target) {
          const id = (visible[0].target as HTMLElement).dataset.workspaceSection;
          if (id) setActiveId(id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: [0, 1] }
    );

    nodesRef.current.forEach((node) => observerRef.current?.observe(node));

    return () => observerRef.current?.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIds.join(",")]);

  const registerSection = useCallback(
    (id: string) => (node: HTMLElement | null) => {
      const prev = nodesRef.current.get(id);
      if (prev && observerRef.current) observerRef.current.unobserve(prev);

      if (node) {
        nodesRef.current.set(id, node);
        observerRef.current?.observe(node);
      } else {
        nodesRef.current.delete(id);
      }
    },
    []
  );

  const scrollToSection = useCallback((id: string) => {
    const node = nodesRef.current.get(id);
    if (!node) return;

    // Ignore the observer's own updates for the duration of the smooth
    // scroll so the highlighted item doesn't flicker mid-flight.
    suppressUntil.current = Date.now() + 700;
    setActiveId(id);
    node.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return { activeId, registerSection, scrollToSection };
}
