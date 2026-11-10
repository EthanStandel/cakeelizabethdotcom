import type { APIEvent } from "@solidjs/start/server";
import { readSiteUrl } from "~/lib/siteUrl";

const TEXT_CONTENT_TYPE = "text/plain; charset=utf-8";
const DISALLOWED_PATHS = ["/admin/", "/api/"];
const SITEMAP_PATH = "/sitemap.xml";

const isProductionHost = (request: Request, siteUrl: string) =>
  new URL(request.url).host === new URL(siteUrl).host;

const productionRobots = (siteUrl: string) =>
  [
    "User-agent: *",
    ...DISALLOWED_PATHS.map((path) => `Disallow: ${path}`),
    "",
    `Sitemap: ${siteUrl}${SITEMAP_PATH}`,
  ].join("\n");

const closedRobots = () => ["User-agent: *", "Disallow: /"].join("\n");

export const GET = ({ request }: APIEvent) => {
  const siteUrl = readSiteUrl();
  const body =
    siteUrl && isProductionHost(request, siteUrl)
      ? productionRobots(siteUrl)
      : closedRobots();
  return new Response(`${body}\n`, {
    headers: { "Content-Type": TEXT_CONTENT_TYPE },
  });
};
