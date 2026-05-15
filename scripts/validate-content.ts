import { readFileSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import matter from "gray-matter";
import { collectionRegistry } from "../src/models/index";

let hasErrors = false;

for (const collection of collectionRegistry) {
  const folder = resolve(process.cwd(), collection.collectionConfig.folder);

  let files: string[];
  try {
    files = readdirSync(folder).filter((f) => f.endsWith(".md"));
  } catch {
    // Folder doesn't exist yet — no content to validate
    continue;
  }

  for (const file of files) {
    const filePath = join(folder, file);
    const raw = readFileSync(filePath, "utf8");
    const { data } = matter(raw);
    const result = collection.schema.safeParse(data);

    if (!result.success) {
      console.error(`\nValidation failed: ${filePath}`);
      for (const issue of result.error.issues) {
        console.error(`  ${issue.path.join(".")}: ${issue.message}`);
      }
      hasErrors = true;
    }
  }
}

if (hasErrors) {
  console.error("\nContent validation failed. Fix errors before building.");
  process.exit(1);
}

console.log("All content files passed validation.");
