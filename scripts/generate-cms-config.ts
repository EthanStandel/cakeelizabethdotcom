import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, join, basename } from "node:path";
import jsYaml from "js-yaml";
import matter from "gray-matter";
import { collectionRegistry } from "../src/models/index";

// --- config.yml ---

const configPath = resolve(process.cwd(), "public/admin/config.yml");
const raw = readFileSync(configPath, "utf8");
const config = jsYaml.load(raw) as Record<string, unknown>;

config["collections"] = collectionRegistry.map((c) => c.collectionConfig);

writeFileSync(configPath, jsYaml.dump(config, { lineWidth: -1 }), "utf8");

console.log(
  `Generated ${collectionRegistry.length} collection(s) → public/admin/config.yml`
);

// --- cms-manifest.json ---

const manifest = {
  collections: collectionRegistry.map((collection) => {
    const folder = resolve(process.cwd(), collection.collectionConfig.folder);
    const entries: Array<Record<string, unknown> & { _slug: string }> = [];

    if (existsSync(folder)) {
      for (const file of readdirSync(folder).filter((f) => f.endsWith(".md"))) {
        const { data } = matter(readFileSync(join(folder, file), "utf8"));
        entries.push({ ...data, _slug: basename(file, ".md") });
      }
    }

    return {
      name: collection.collectionConfig.name,
      label: collection.collectionConfig.label,
      folder: collection.collectionConfig.folder,
      fields: collection.collectionConfig.fields,
      entries,
    };
  }),
};

writeFileSync(
  resolve(process.cwd(), "public/cms-manifest.json"),
  JSON.stringify(manifest, null, 2),
  "utf8"
);

console.log(`Generated public/cms-manifest.json`);
