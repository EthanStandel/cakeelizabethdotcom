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

// Cached per server instance / browser session. Content is static after generate:cms runs.
let manifestCache: CmsManifest | null = null;

async function getManifest(): Promise<CmsManifest> {
  if (!isDev && manifestCache) return manifestCache;
  const base = import.meta.env.VITE_SERVER_URL ?? "";
  const fetchOptions: RequestInit = isDev ? { cache: "no-store" } : {};
  const res = await fetch(`${base}/cms-manifest.json`, fetchOptions);
  if (!res.ok) throw new Error(`Failed to load CMS manifest: ${res.status}`);
  const data = (await res.json()) as CmsManifest;
  if (!isDev) manifestCache = data;
  return data;
}

export async function getCollectionItem<F extends CmsFieldsMap>(
  collection: CollectionDefinition<F>,
  slug: string
): Promise<ContentItem<F> | undefined> {
  const manifest = await getManifest();
  const found = manifest.collections.find((c) => c.name === collection.name);
  if (!found?.slugs.includes(slug)) return undefined;
  const base = import.meta.env.VITE_SERVER_URL ?? "";
  const servePath = collection.collectionConfig.folder.replace(/^public/, "");
  const fetchOptions: RequestInit = isDev ? { cache: "no-store" } : {};
  const res = await fetch(`${base}${servePath}/${slug}.json`, fetchOptions);
  if (!res.ok) return undefined;
  const data = await res.json();
  const parsed = collection.schema.parse(nullToUndefined(data));
  return { ...parsed, _slug: slug } as ContentItem<F>;
}

export async function getCollection<F extends CmsFieldsMap>(
  collection: CollectionDefinition<F>
): Promise<ContentItem<F>[]> {
  const manifest = await getManifest();
  const found = manifest.collections.find((c) => c.name === collection.name);
  if (!found) return [];
  const items = await Promise.all(
    found.slugs.map((slug) => getCollectionItem(collection, slug))
  );
  return items.filter((i): i is Awaited<ContentItem<F>> => i !== undefined);
}
