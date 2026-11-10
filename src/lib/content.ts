import { getRequestEvent, isServer } from "solid-js/web";
import type {
  CollectionDefinition,
  CmsFieldsMap,
  InferFields,
} from "./cms/types";

export type ContentItem<F extends CmsFieldsMap> = InferFields<F> & {
  _slug: string;
};

interface ManifestCollection {
  name: string;
  folder: string;
  slugs: string[];
}

interface CmsManifest {
  collections: ManifestCollection[];
}

type ContentFetch = NonNullable<App.RequestEventLocals["contentFetch"]>;

function nullToUndefined(value: unknown): unknown {
  if (value === null) return undefined;
  if (Array.isArray(value)) return value.map(nullToUndefined);
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k,
        nullToUndefined(v),
      ])
    );
  }
  return value;
}

const isDev = import.meta.env.DEV;

let manifestCache: { origin: string; manifest: CmsManifest } | undefined;

// The server fetches from the origin the current request reached, because a server-side fetch needs an absolute address; the browser fetches same-origin.
function getContentOrigin(): string {
  if (!isServer) return "";
  const event = getRequestEvent();
  if (!event) {
    throw new Error("Content can only be fetched on the server during a request");
  }
  return new URL(event.request.url).origin;
}

// While Nitro prerenders a page no server listens on the request's origin, so the middleware supplies a fetch that reaches the Nitro app in the same process.
function getContentFetch(): ContentFetch {
  if (!isServer) return fetch;
  return getRequestEvent()?.locals.contentFetch ?? fetch;
}

// Cached per origin for the life of the server process or browser session, since content is static after generate:cms runs; a request under another host name replaces the entry rather than reading it.
async function getManifest(origin: string): Promise<CmsManifest> {
  if (!isDev && manifestCache?.origin === origin) return manifestCache.manifest;
  const fetchOptions: RequestInit = isDev ? { cache: "no-store" } : {};
  const res = await getContentFetch()(
    `${origin}/cms-manifest.json`,
    fetchOptions
  );
  if (!res.ok) throw new Error(`Failed to load CMS manifest: ${res.status}`);
  const manifest = (await res.json()) as CmsManifest;
  if (!isDev) manifestCache = { origin, manifest };
  return manifest;
}

export async function getCollectionItem<F extends CmsFieldsMap>(
  collection: CollectionDefinition<F>,
  slug: string
): Promise<ContentItem<F> | undefined> {
  const origin = getContentOrigin();
  const manifest = await getManifest(origin);
  const found = manifest.collections.find((c) => c.name === collection.name);
  if (!found?.slugs.includes(slug)) return undefined;
  const servePath = collection.collectionConfig.folder.replace(/^public/, "");
  const fetchOptions: RequestInit = isDev ? { cache: "no-store" } : {};
  const res = await getContentFetch()(
    `${origin}${servePath}/${slug}.json`,
    fetchOptions
  );
  if (!res.ok) return undefined;
  const data = await res.json();
  const parsed = collection.schema.parse(nullToUndefined(data));
  return { ...parsed, _slug: slug } as ContentItem<F>;
}

export async function getCollection<F extends CmsFieldsMap>(
  collection: CollectionDefinition<F>
): Promise<ContentItem<F>[]> {
  const manifest = await getManifest(getContentOrigin());
  const found = manifest.collections.find((c) => c.name === collection.name);
  if (!found) return [];
  const items = await Promise.all(
    found.slugs.map((slug) => getCollectionItem(collection, slug))
  );
  return items.filter((i): i is Awaited<ContentItem<F>> => i !== undefined);
}
