/// <reference types="@solidjs/start/env" />

declare global {
  type nil = null | undefined;

  namespace App {
    interface RequestEventLocals {
      contentFetch?: (input: string, init?: RequestInit) => Promise<Response>;
    }
  }
}

export {};
