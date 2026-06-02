export interface CmsMessageMap {
  "cms-field-focus": { fieldPath: string; collection?: string; slug?: string };
  "cms-route-change": { path: string; source: "push" | "replace" | "pop" };
  "cms-preview-update": { slug: string; data: Record<string, unknown> };
}

export type CmsMessage = {
  [T in keyof CmsMessageMap]: { type: T; payload: CmsMessageMap[T] };
}[keyof CmsMessageMap];

export type CmsMessageHandlers = {
  [T in keyof CmsMessageMap]?: (payload: CmsMessageMap[T]) => void;
};

export function dispatch<T extends keyof CmsMessageMap>(
  target: Window,
  type: T,
  payload: CmsMessageMap[T]
): void {
  target.postMessage({ type, payload }, window.location.origin);
}

export function createMessageHandler(handlers: CmsMessageHandlers) {
  return (event: MessageEvent) => {
    const msg = event.data as CmsMessage;
    if (!msg?.type) return;
    const handler = handlers[msg.type as keyof CmsMessageMap];
    if (handler) (handler as (payload: unknown) => void)(msg.payload);
  };
}
