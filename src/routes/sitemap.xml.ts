import type { APIEvent } from "@solidjs/start/server";
import { getCollection } from "~/lib/content";
import { readSiteUrl } from "~/lib/siteUrl";
import { PageShape } from "~/models";
import { getPagePath } from "~/models/Page.shape";
import { NOT_FOUND_PAGE_SLUG } from "~/models/NotFound.shape";

const XML_CONTENT_TYPE = "application/xml; charset=utf-8";
const SITEMAP_NAMESPACE = "http://www.sitemaps.org/schemas/sitemap/0.9";
const UNAVAILABLE = 503;

const escapeXml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const renderSitemap = (addresses: string[]) =>
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<urlset xmlns="${SITEMAP_NAMESPACE}">`,
    ...addresses.map(
      (address) => `  <url><loc>${escapeXml(address)}</loc></url>`,
    ),
    "</urlset>",
    "",
  ].join("\n");

export const GET = async (_event: APIEvent) => {
  const siteUrl = readSiteUrl();
  if (!siteUrl) return new Response(null, { status: UNAVAILABLE });
  const pages = await getCollection(PageShape);
  const addresses = pages
    .filter((page) => page._slug !== NOT_FOUND_PAGE_SLUG && !page.seo?.noindex)
    .map((page) => `${siteUrl}${getPagePath(page._slug)}`)
    .sort();
  return new Response(renderSitemap(addresses), {
    headers: { "Content-Type": XML_CONTENT_TYPE },
  });
};
