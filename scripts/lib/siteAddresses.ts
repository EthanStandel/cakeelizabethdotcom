import { existsSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { PageShape, getPagePath } from "../../src/models/Page.shape";

const PUBLIC_FOLDER = "public";
const INDEX_FILE = "index.html";

export const readPageAddresses = () =>
  new Set(
    readdirSync(resolve(process.cwd(), PageShape.collectionConfig.folder))
      .filter((file) => file.endsWith(".md"))
      .map((file) => getPagePath(file.replace(/\.md$/, ""))),
  );

export const pathOf = (address: string) => address.split("?")[0];

export const isPublicFile = (path: string) => {
  const filePath = join(process.cwd(), PUBLIC_FOLDER, path);
  return existsSync(path.endsWith("/") ? join(filePath, INDEX_FILE) : filePath);
};
