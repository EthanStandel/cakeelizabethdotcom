import { createMiddleware } from "@solidjs/start/middleware";
import { getRequestEvent } from "solid-js/web";
import { serverFetch } from "nitro/app";
import { useStorage } from "nitro/storage";
import { normalizePath } from "~/lib/normalizePath";
import { REDIRECT_STATUS } from "~/lib/redirects";
import {
  PRERENDERED_PAGES_ASSETS,
  PRERENDER_HEADER,
  toPrerenderedPageFile,
} from "~/lib/prerenderedPages";

const PRERENDERED_PAGE_METHODS = new Set(["GET", "HEAD"]);
const HTML_CONTENT_TYPE = "text/html; charset=utf-8";

const prerenderedPages = useStorage<string>(
  `assets:${PRERENDERED_PAGES_ASSETS}`,
);

export default createMiddleware([
  (event) => {
    const { pathname, search } = event.url;
    const normalized = normalizePath(pathname);
    if (normalized === pathname) return;
    return new Response(null, {
      status: REDIRECT_STATUS,
      headers: { Location: `${normalized}${search}` },
    });
  },
  (event) => {
    if (!event.req.headers.has(PRERENDER_HEADER)) return;
    const requestEvent = getRequestEvent();
    if (requestEvent) requestEvent.locals.contentFetch = serverFetch;
  },
  async (event) => {
    if (event.req.headers.has(PRERENDER_HEADER)) return;
    if (!PRERENDERED_PAGE_METHODS.has(event.req.method)) return;
    if (event.url.search) return;
    const page = await prerenderedPages.getItem(
      toPrerenderedPageFile(event.url.pathname),
    );
    if (typeof page !== "string") return;
    return new Response(page, {
      headers: { "Content-Type": HTML_CONTENT_TYPE },
    });
  },
]);
