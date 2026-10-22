import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { normalizePath } from "../src/lib/normalizePath";
import { REDIRECT_STATUS, findRedirect } from "../src/lib/redirects";
import { isPublicFile, pathOf, readPageAddresses } from "./lib/siteAddresses";

const ADDRESS_LIST = "specs/007-seo/crawl/new-site.csv";
const OK_STATUS = 200;
const NOT_FOUND_STATUS = 404;

const baseUrl = process.argv[2]?.replace(/\/$/, "");
if (!baseUrl) {
  console.error("Usage: npm run check:redirects -- <base address>");
  process.exit(1);
}

const readAddresses = () =>
  readFileSync(resolve(process.cwd(), ADDRESS_LIST), "utf8")
    .trim()
    .split("\n")
    .slice(1)
    .map((row) => row.split(",")[0]);

const request = (address: string) =>
  fetch(new URL(address, baseUrl), { redirect: "manual" });

const sortedParams = (url: URL) => [...url.searchParams].map(String).sort();

const isSameAddress = (actual: URL, expected: URL) =>
  actual.pathname === expected.pathname &&
  JSON.stringify(sortedParams(actual)) ===
    JSON.stringify(sortedParams(expected));

const expectedTarget = (address: string, target: string) => {
  const expected = new URL(target, baseUrl);
  for (const [key, value] of new URL(address, baseUrl).searchParams) {
    expected.searchParams.append(key, value);
  }
  return expected;
};

async function checkRedirected(address: string, target: string) {
  const response = await request(address);
  if (response.status !== REDIRECT_STATUS) {
    return `answered ${response.status}, expected ${REDIRECT_STATUS} to ${target}`;
  }
  const location = new URL(response.headers.get("Location") ?? "", baseUrl);
  if (!isSameAddress(location, expectedTarget(address, target))) {
    return `went to ${location.pathname}${location.search}, expected ${target}`;
  }
  const landing = await request(`${location.pathname}${location.search}`);
  return landing.status === OK_STATUS
    ? undefined
    : `target ${location.pathname} answered ${landing.status}`;
}

async function checkServed(address: string) {
  const response = await fetch(new URL(address, baseUrl));
  return response.status === OK_STATUS
    ? undefined
    : `answered ${response.status}, expected ${OK_STATUS}`;
}

// A missing address may first be normalized by the middleware, in one hop, to the address that answers 404.
async function checkMissing(address: string) {
  const path = pathOf(address);
  const normalized = normalizePath(path);
  const response = await request(address);
  if (normalized !== path) {
    const location = new URL(response.headers.get("Location") ?? "", baseUrl);
    if (
      response.status !== REDIRECT_STATUS ||
      location.pathname !== normalized
    ) {
      return `answered ${response.status}, expected ${REDIRECT_STATUS} to ${normalized}`;
    }
    const landing = await request(`${location.pathname}${location.search}`);
    return landing.status === NOT_FOUND_STATUS
      ? undefined
      : `${normalized} answered ${landing.status}, expected ${NOT_FOUND_STATUS}`;
  }
  return response.status === NOT_FOUND_STATUS
    ? undefined
    : `answered ${response.status}, expected ${NOT_FOUND_STATUS}`;
}

const pageAddresses = readPageAddresses();
const counts = { redirected: 0, served: 0, missing: 0 };
const failures: string[] = [];

for (const address of readAddresses()) {
  const path = pathOf(address);
  const redirect = findRedirect(path);
  const kind = redirect
    ? "redirected"
    : pageAddresses.has(path) || isPublicFile(path)
      ? "served"
      : "missing";
  counts[kind] += 1;
  const failure =
    kind === "redirected"
      ? await checkRedirected(address, redirect!.to)
      : kind === "served"
        ? await checkServed(address)
        : await checkMissing(address);
  if (failure) failures.push(`${address}: ${failure}`);
}

console.log(
  `Checked ${counts.redirected} redirected, ${counts.served} served, and ${counts.missing} missing addresses against ${baseUrl}.`,
);

if (failures.length > 0) {
  console.error("\nRedirect check failed:");
  for (const failure of failures) {
    console.error(`  ${failure}`);
  }
  process.exit(1);
}

console.log("Every address answered as expected.");
