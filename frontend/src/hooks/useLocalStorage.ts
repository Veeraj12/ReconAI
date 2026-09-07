"use client";

import { useEffect, useState } from "react";

export function useLocalStorage(key: string, defaultValue: boolean) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    // Deliberately reading localStorage here rather than in a lazy
    // useState initializer: localStorage doesn't exist during Next.js's
    // server render, so reading it there would make the client's first
    // render disagree with the server-rendered HTML — a hydration
    // mismatch, which is worse than the one-frame default-state flash
    // this pattern accepts instead.
    const stored = localStorage.getItem(key);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- see above
    if (stored !== null) setValue(stored === "true");
  }, [key]);

  const setAndPersist = (next: boolean) => {
    setValue(next);
    localStorage.setItem(key, String(next));
  };

  return [value, setAndPersist] as const;
}
