import { matchesRedirectSource, redirects } from "../src/lib/redirects";
import { isPublicFile, pathOf, readPageAddresses } from "./lib/siteAddresses";

const pageAddresses = readPageAddresses();
const errors: string[] = [];
const seenSources = new Set<string>();

for (const { from, to } of redirects) {
  if (!from.startsWith("/")) errors.push(`${from}: source is not a path`);
  if (seenSources.has(from)) errors.push(`${from}: listed more than once`);
  seenSources.add(from);

  for (const address of pageAddresses) {
    if (matchesRedirectSource(from, address)) {
      errors.push(`${from}: shadows the page at ${address}`);
    }
  }

  const targetPath = pathOf(to);
  const chained = redirects.find(({ from: other }) =>
    matchesRedirectSource(other, targetPath),
  );
  if (chained) {
    errors.push(`${from}: target ${to} is redirected again by ${chained.from}`);
  }

  if (!pageAddresses.has(targetPath) && !isPublicFile(targetPath)) {
    errors.push(`${from}: target ${to} is neither a page nor a public file`);
  }
}

if (errors.length > 0) {
  console.error("\nRedirect validation failed:");
  for (const error of errors) {
    console.error(`  ${error}`);
  }
  process.exit(1);
}

console.log(`All ${redirects.length} redirects passed validation.`);
