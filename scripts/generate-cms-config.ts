import {
  writeFileSync,
  readFileSync,
  readdirSync,
  mkdirSync,
  existsSync,
  watch,
} from "node:fs";
import { resolve, join, basename } from "node:path";
import jsYaml from "js-yaml";
import matter from "gray-matter";
import { collectionRegistry } from "../src/models/index";
import type { DecapFieldConfig } from "../src/lib/cms/types";

const isDev = process.argv.includes("--dev");
const isWatch = process.argv.includes("--watch");

type ContentMap = Record<string, Array<{ slug: string; data: Record<string, unknown> }>>;

function buildContentMap(): ContentMap {
  const map: ContentMap = {};
  for (const collection of collectionRegistry) {
    const folderPath = resolve(process.cwd(), collection.collectionConfig.folder);
    const entries: Array<{ slug: string; data: Record<string, unknown> }> = [];
    if (existsSync(folderPath)) {
      for (const file of readdirSync(folderPath).filter((f) => f.endsWith(".md"))) {
        const slug = basename(file, ".md");
        const { data } = matter(readFileSync(join(folderPath, file), "utf8"));
        entries.push({ slug, data });
      }
    }
    map[collection.collectionConfig.name] = entries;
  }
  return map;
}

function resolveField(field: DecapFieldConfig, contentMap: ContentMap): DecapFieldConfig {
  let result = { ...field };

  if (result.ref_options) {
    const entries = contentMap[result.ref_options.collection] ?? [];
    const options = [
      ...new Set(
        entries.flatMap(({ data }) => {
          const val = data[result.ref_options!.field];
          if (Array.isArray(val)) return val.filter((v): v is string => typeof v === "string");
          if (typeof val === "string") return [val];
          return [];
        })
      ),
    ].sort();
    delete result.ref_options;
    result.options = options;
  }

  if (result.fields) result.fields = result.fields.map((f) => resolveField(f, contentMap));
  if (result.types) result.types = result.types.map((f) => resolveField(f, contentMap));
  if (result.field) result.field = resolveField(result.field, contentMap);

  return result;
}

function generate() {
  // Read all content up front so ref_options can be resolved during config generation
  const contentMap = buildContentMap();

  // --- config.yml ---

  const config = {
    ...(isDev && { local_backend: true }),
    backend: isDev
      ? { name: "test-repo" }
      : {
          name: "github",
          repo: process.env.CMS_GITHUB_REPO,
          branch: process.env.CMS_GITHUB_BRANCH ?? "main",
        },
    media_folder: "public/images",
    public_folder: "/images",
    collections: collectionRegistry.map((c) => ({
      ...c.collectionConfig,
      fields: c.collectionConfig.fields.map((f) => resolveField(f, contentMap)),
    })),
  };

  const configPath = resolve(process.cwd(), "public/admin/config.yml");
  mkdirSync(resolve(process.cwd(), "public/admin"), { recursive: true });
  writeFileSync(configPath, jsYaml.dump(config, { lineWidth: -1 }), "utf8");

  console.log(
    `Generated ${collectionRegistry.length} collection(s) → public/admin/config.yml (${isDev ? "dev" : "build"})`
  );

  // --- cms-manifest.json + per-entry JSON files ---

  const manifest = {
    collections: collectionRegistry.map((collection) => {
      const folderPath = resolve(process.cwd(), collection.collectionConfig.folder);
      const entries = contentMap[collection.collectionConfig.name] ?? [];

      for (const { slug, data } of entries) {
        writeFileSync(
          join(folderPath, `${slug}.json`),
          JSON.stringify(data, null, 2),
          "utf8"
        );
      }

      return {
        name: collection.collectionConfig.name,
        folder: collection.collectionConfig.folder,
        slugs: entries.map((e) => e.slug),
      };
    }),
  };

  writeFileSync(
    resolve(process.cwd(), "public/cms-manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf8"
  );

  console.log(`Generated public/cms-manifest.json + per-entry JSON files`);
}

generate();

if (isWatch) {
  const folders = collectionRegistry
    .map((c) => resolve(process.cwd(), c.collectionConfig.folder))
    .filter(existsSync);

  for (const folder of folders) {
    watch(folder, (_, filename) => {
      if (filename?.endsWith(".md")) {
        console.log(`Detected change in ${filename}, regenerating...`);
        generate();
      }
    });
  }

  console.log(`Watching ${folders.length} content folder(s) for .md changes`);
}
