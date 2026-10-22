/// <reference types="@solidjs/start/env" />

declare global {
  type nil = null | undefined;

  const __THEME_CONTAINER_DSK_PX__: number;
  const __THEME_DEFAULT_TRANSITION_DURATION_MS__: number;

  namespace App {
    interface RequestEventLocals {
      contentFetch?: (input: string, init?: RequestInit) => Promise<Response>;
    }
  }
}

export {};
