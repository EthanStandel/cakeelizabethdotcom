import { createAsync, query } from "@solidjs/router";
import type { Accessor } from "solid-js";
import type { CollectionDefinition, CmsFieldsMap } from "~/lib/cms/types";
import type { ContentItem } from "~/lib/content";
import { createCmsLiveContent } from "./createCmsLiveContent";

export function contentQuery<TArgs extends readonly unknown[], T>(
  key: string,
  fn: (...args: TArgs) => Promise<T>
): (...args: TArgs) => Promise<T> {
  return import.meta.env.DEV ? fn : (query(fn, key) as unknown as (...args: TArgs) => Promise<T>);
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

// Combines a parameterized fetch with CMS live-preview, merging them into one signal.
// Uses collection.name as the cache key.
export function createCmsContent<F extends CmsFieldsMap>(
  collection: CollectionDefinition<F>,
  fn: (slug: string) => Promise<ContentItem<F> | undefined>,
  slug: () => string
): Accessor<ContentItem<F> | undefined> {
  const fetched = createContentFetch(collection.name, fn, () => [slug()] as const);
  const liveContent = createCmsLiveContent(collection, slug);
  return () => liveContent() ?? fetched();
}
