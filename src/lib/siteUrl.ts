import { query } from "@solidjs/router";

export const readSiteUrl = (): string | undefined =>
  process.env.SITE_URL?.trim() || undefined;

export const getSiteUrl = query(async () => {
  "use server";
  return readSiteUrl();
}, "site-url");

export const toAbsoluteUrl = (siteUrl: string, address: string) =>
  new URL(address, siteUrl).href;
