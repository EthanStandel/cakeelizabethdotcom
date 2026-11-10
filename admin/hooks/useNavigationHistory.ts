import { useRef, useState } from "react";

export interface NavigationHistory {
  push(path: string): void;
  replace(path: string): void;
  reset(path: string): void;
  back(navigate: (path: string) => void): void;
  forward(navigate: (path: string) => void): void;
  canGoBack: boolean;
  canGoForward: boolean;
}

export function useNavigationHistory(initialPath: string): NavigationHistory {
  const stack = useRef<string[]>([initialPath]);
  const index = useRef(0);
  const skipNextPush = useRef(false);
  const [, setTick] = useState(0);
  const bump = () => setTick((n) => n + 1);

  return {
    push(path) {
      if (skipNextPush.current) { skipNextPush.current = false; return; }
      if (stack.current[index.current] === path) return;
      stack.current = [...stack.current.slice(0, index.current + 1), path];
      index.current = stack.current.length - 1;
      bump();
    },
    replace(path) {
      if (stack.current[index.current] === path) return;
      const next = [...stack.current];
      next[index.current] = path;
      stack.current = next;
      bump();
    },
    reset(path) {
      stack.current = [path];
      index.current = 0;
      skipNextPush.current = true;
      bump();
    },
    back(navigate) {
      if (index.current <= 0) return;
      skipNextPush.current = true;
      index.current--;
      navigate(stack.current[index.current]);
      bump();
    },
    forward(navigate) {
      if (index.current >= stack.current.length - 1) return;
      skipNextPush.current = true;
      index.current++;
      navigate(stack.current[index.current]);
      bump();
    },
    canGoBack: index.current > 0,
    canGoForward: index.current < stack.current.length - 1,
  };
}
