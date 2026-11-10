import { HOME_PAGE_PATH } from "./pagePaths";

export const PRERENDERED_PAGES_ASSETS = "prerendered-pages";
export const PRERENDER_HEADER = "x-nitro-prerender";

const HOME_PAGE_FILE = "index.html";
const PAGE_FILE_EXTENSION = ".html";

export const toPrerenderedPageFile = (path: string) =>
  path === HOME_PAGE_PATH
    ? HOME_PAGE_FILE
    : `${path.slice(1)}${PAGE_FILE_EXTENSION}`;
