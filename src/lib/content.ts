import type {
  CollectionDefinition,
  CmsFieldsMap,
  InferFields,
} from "./cms/types";

export type ContentItem<F extends CmsFieldsMap> = InferFields<F> & {
  _slug: string;
};

interface ManifestEntry extends Record<string, unknown> {
  _slug: string;
}

interface ManifestCollection {
  name: string;
  label: string;
  folder: string;
  entries: ManifestEntry[];
}

interface CmsManifest {
  collections: ManifestCollection[];
}

// Cached per server instance / browser session. Content is static after generate:cms runs.
let manifestCache: CmsManifest | null = null;

async function getManifest(): Promise<CmsManifest> {
  if (manifestCache) return manifestCache;
  const base = import.meta.env.VITE_SERVER_URL ?? "";
  const res = await fetch(`${base}/cms-manifest.json`);
  if (!res.ok) throw new Error(`Failed to load CMS manifest: ${res.status}`);
  manifestCache = (await res.json()) as CmsManifest;
  return manifestCache;
}

export async function getCollection<F extends CmsFieldsMap>(
  collection: CollectionDefinition<F>
): Promise<ContentItem<F>[]> {
  const manifest = await getManifest();
  const found = manifest.collections.find((c) => c.name === collection.name);
  if (!found) return [];
  return found.entries.map((entry) => {
    const parsed = collection.schema.parse(entry);
    return { ...parsed, _slug: entry._slug } as ContentItem<F>;
  });
}

export async function getCollectionItem<F extends CmsFieldsMap>(
  collection: CollectionDefinition<F>,
  slug: string
): Promise<ContentItem<F> | undefined> {
  const manifest = await getManifest();
  const found = manifest.collections.find((c) => c.name === collection.name);
  if (!found) return undefined;
  const entry = found.entries.find((e) => e._slug === slug);
  if (!entry) return undefined;
  const parsed = collection.schema.parse(entry);
  return { ...parsed, _slug: entry._slug } as ContentItem<F>;
}
