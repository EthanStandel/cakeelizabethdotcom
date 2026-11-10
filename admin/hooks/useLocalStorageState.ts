import { useState, useEffect, Dispatch, SetStateAction } from "react";

export function useLocalStorageState<T>(
  key: string,
  defaultValue: T,
  options?: { initializeToDefault?: () => boolean }
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      if (options?.initializeToDefault?.()) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
      }
      const item = localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // quota exceeded or private browsing
    }
  }, [key, state]);

  return [state, setState];
}
