import { useEffect } from "react";
import { createMessageHandler, type CmsMessageHandlers } from "~/lib/cms/messages";

export function useMessageHandler(handlers: CmsMessageHandlers) {
  useEffect(() => {
    const handler = createMessageHandler(handlers);
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, Object.values(handlers));
}
