import { loadEnv } from "vite";

const REQUIRED_VARIABLES = [
  "CMS_GITHUB_REPO",
  "MAIL_API_KEY",
  "MAIL_FROM",
  "MAIL_TARGET",
  "SITE_URL",
];

const BUILD_MODE = "production";

const env = loadEnv(BUILD_MODE, process.cwd(), "");
const isSkipped = env.SKIP_ENV_CHECK === "true";

console.log(
  isSkipped
    ? "Environment check skipped: SKIP_ENV_CHECK is true."
    : "Environment check on: SKIP_ENV_CHECK is not true.",
);

if (isSkipped) process.exit(0);

const missing = REQUIRED_VARIABLES.filter((name) => !env[name]?.trim());

if (missing.length > 0) {
  console.error("\nMissing environment variables:");
  for (const name of missing) {
    console.error(`  ${name}`);
  }
  console.error(
    "\nEnvironment validation failed. Set them before building, or set SKIP_ENV_CHECK=true for a build that sends no mail.",
  );
  process.exit(1);
}

console.log("All required environment variables are set.");
