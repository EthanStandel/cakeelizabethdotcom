import {
  writeFileSync,
  readFileSync,
  readdirSync,
  existsSync,
  watch,
} from "node:fs";
import { resolve, join, basename } from "node:path";
import jsYaml from "js-yaml";
import matter from "gray-matter";
import { collectionRegistry } from "../src/models/index";

const isDev = process.argv.includes("--dev");
const isWatch = process.argv.includes("--watch");

function generate() {
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
    collections: collectionRegistry.map((c) => c.collectionConfig),
  };

  const configPath = resolve(process.cwd(), "public/admin/config.yml");
  writeFileSync(configPath, jsYaml.dump(config, { lineWidth: -1 }), "utf8");

  console.log(
    `Generated ${collectionRegistry.length} collection(s) → public/admin/config.yml (${isDev ? "dev" : "build"})`
  );

  // --- cms-manifest.json + per-entry JSON files ---

  const manifest = {
    collections: collectionRegistry.map((collection) => {
      const folderPath = resolve(
        process.cwd(),
        collection.collectionConfig.folder
      );
      const slugs: string[] = [];

      if (existsSync(folderPath)) {
        for (const file of readdirSync(folderPath).filter((f) =>
          f.endsWith(".md")
        )) {
          const slug = basename(file, ".md");
          const { data } = matter(readFileSync(join(folderPath, file), "utf8"));
          writeFileSync(
            join(folderPath, `${slug}.json`),
            JSON.stringify(data, null, 2),
            "utf8"
          );
          slugs.push(slug);
        }
      }

      return {
        name: collection.collectionConfig.name,
        folder: collection.collectionConfig.folder,
        slugs,
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
