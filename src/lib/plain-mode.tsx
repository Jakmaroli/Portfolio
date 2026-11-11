"use client";

/**
 * Plain-mode context — controls the --no-graph / ?plain toggle.
 *
 * When plain is true the graph is hidden and the log renders as a
 * simple list (for recruiters in a hurry or reduced-motion users).
 *
 * TODO(jak): wire ?plain URL param sync (requires useSyncExternalStore
 * to avoid the react-hooks/set-state-in-effect lint rule).
 */

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface PlainModeValue {
  plain: boolean;
  toggle: () => void;
}

const PlainModeContext = createContext<PlainModeValue>({
  plain: false,
  toggle: () => {},
});

export function PlainModeProvider({ children }: { children: ReactNode }) {
  const [plain, setPlain] = useState(false);
  const toggle = useCallback(() => setPlain((p) => !p), []);

  return (
    <PlainModeContext.Provider value={{ plain, toggle }}>
      {children}
    </PlainModeContext.Provider>
  );
}

export function usePlainMode() {
  return useContext(PlainModeContext);
}
