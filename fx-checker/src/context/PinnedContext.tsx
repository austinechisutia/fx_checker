import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

const STORAGE_KEY = 'fx-pinned';

interface PinnedContextValue {
  pinned: Set<string>;
  togglePin: (pair: string) => void;
  isPinned: (pair: string) => boolean;
}

const PinnedContext = createContext<PinnedContextValue | null>(null);

function loadPinned(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

export function PinnedProvider({ children }: { children: ReactNode }) {
  const [pinned, setPinned] = useState<Set<string>>(loadPinned);

  function togglePin(pair: string) {
    setPinned((prev) => {
      const next = new Set(prev);
      if (next.has(pair)) next.delete(pair);
      else next.add(pair);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }

  function isPinned(pair: string) {
    return pinned.has(pair);
  }

  return (
    <PinnedContext.Provider value={{ pinned, togglePin, isPinned }}>
      {children}
    </PinnedContext.Provider>
  );
}

export function usePinned() {
  const ctx = useContext(PinnedContext);
  if (!ctx) throw new Error('usePinned must be used inside PinnedProvider');
  return ctx;
}
