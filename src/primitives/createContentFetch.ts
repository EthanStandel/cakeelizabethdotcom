import { createAsync, query } from "@solidjs/router";
import { createEffect } from "solid-js";
import { createStore, reconcile } from "solid-js/store";
import type { Accessor } from "solid-js";
import type { CollectionDefinition, CmsFieldsMap } from "~/lib/cms/types";
import type { ContentItem } from "~/lib/content";
import { createCmsLiveContent } from "./createCmsLiveContent";

export function contentQuery<TArgs extends readonly unknown[], T>(
  key: string,
  fn: (...args: TArgs) => Promise<T>
): (...args: TArgs) => Promise<T> {
  return import.meta.env.DEV
    ? fn
    : (query(fn, key) as unknown as (...args: TArgs) => Promise<T>);
}

// Zero-arg overload (singleton fetches — no preload needed)
export function createContentFetch<T>(
  key: string,
  fn: () => Promise<T>
): Accessor<T | undefined>;
// Parameterized overload (reactive args — caller exposes contentQuery result for preload)
export function createContentFetch<TArgs extends readonly unknown[], T>(
  key: string,
  fn: (...args: TArgs) => Promise<T>,
  args: () => Readonly<TArgs>
): Accessor<T | undefined>;
export function createContentFetch<TArgs extends readonly unknown[], T>(
  key: string,
  fn: (...args: TArgs) => Promise<T>,
  args?: () => Readonly<TArgs>
): Accessor<T | undefined> {
  const cached = contentQuery(key, fn);
  return createAsync(() => cached(...(args?.() ?? ([] as unknown as TArgs))));
}

// Combines a parameterized fetch with CMS live-preview into a single reconciled store.
// Fetched data initializes the store; live updates reconcile into the same proxy so
// <Show> never sees a reference change and downstream rerenders are eliminated.
// Uses collection.name as the cache key.
export function createCmsContent<F extends CmsFieldsMap>(
  collection: CollectionDefinition<F>,
  fn: (slug: string) => Promise<ContentItem<F> | undefined>,
  slug: () => string
): Accessor<ContentItem<F> | undefined> {
  const fetched = createContentFetch(
    collection.name,
    fn,
    () => [slug()] as const
  );
  const liveContent = createCmsLiveContent(collection, slug);

  const [state, setState] = createStore<{
    content: ContentItem<F> | undefined;
  }>({
    content: undefined,
  });

  createEffect(() => {
    const initial = fetched();
    const preview = liveContent();
    const incoming = preview ?? initial;
    if (incoming == null) return;
    const isLiveUpdate = liveContent() != null;
    const scrollY = isLiveUpdate ? window.scrollY : 0;
    setState("content", reconcile(incoming));
    if (scrollY > 0) {
      setTimeout(() => window.scrollTo(0, scrollY), 0);
    }
  });

  // Fall back to fetched() directly until the effect has initialized the store
  // (covers SSR and the brief moment before the first effect run on the client).
  return () => state.content ?? fetched();
}
