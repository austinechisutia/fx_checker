import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

const STORAGE_KEY = 'fx-log';

export interface LogEntry {
  id: string;
  timestamp: number;
  base: string;
  quote: string;
  sendAmount: number;
  receiveAmount: number;
  rate: number;
}

interface LogContextValue {
  entries: LogEntry[];
  addEntry: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  deleteEntry: (id: string) => void;
  clearAll: () => void;
}

const LogContext = createContext<LogContextValue | null>(null);

function loadEntries(): LogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(entries: LogEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function LogProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<LogEntry[]>(loadEntries);

  function addEntry(entry: Omit<LogEntry, 'id' | 'timestamp'>) {
    const next: LogEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    setEntries((prev) => {
      const updated = [next, ...prev];
      save(updated);
      return updated;
    });
  }

  function deleteEntry(id: string) {
    setEntries((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      save(updated);
      return updated;
    });
  }

  function clearAll() {
    setEntries([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <LogContext.Provider value={{ entries, addEntry, deleteEntry, clearAll }}>
      {children}
    </LogContext.Provider>
  );
}

export function useLog() {
  const ctx = useContext(LogContext);
  if (!ctx) throw new Error('useLog must be used inside LogProvider');
  return ctx;
}
