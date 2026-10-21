import { readFileSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { nitro } from "nitro/vite";
import type { Nitro } from "nitro/types";
import tailwindcss from "@tailwindcss/vite";
import { solidStart } from "@solidjs/start/config";
import { REDIRECT_STATUS, redirects } from "./src/lib/redirects";
import { PAGE_COLLECTION_NAME, getPagePath } from "./src/lib/pagePaths";
import {
  PRERENDERED_PAGES_ASSETS,
  toPrerenderedPageFile,
} from "./src/lib/prerenderedPages";

// Mounted at `/admin` because Nitro's dev middleware runs before Vite's proxy and leaves alone only the paths another middleware is mounted on, so the mount is what lets `/admin` reach the admin server.
const adminTrailingSlash = (): Plugin => ({
  name: "admin-trailing-slash",
  configureServer(server) {
    server.middlewares.use("/admin", (req, res, next) => {
      if (req.originalUrl === "/admin") {
        res.writeHead(301, { Location: "/admin/" });
        res.end();
      } else {
        next();
      }
    });
  },
});

const SERVER_ENV_PREFIXES = ["MAIL_", "NO_MAIL", "SITE_URL", "GITHUB_OAUTH_"];

// Vite exposes env files only on import.meta.env, so the server-only variables are copied to process.env; loadEnv already lets the shell's value win. A build fixes SITE_URL into the bundle, so the origin only has to be set where the site is built.
const serverEnv = (): Plugin => ({
  name: "server-env",
  config(_config, { mode, command }) {
    Object.assign(
      process.env,
      loadEnv(mode, process.cwd(), SERVER_ENV_PREFIXES),
    );
    if (command !== "build") return;
    return {
      define: {
        "process.env.SITE_URL": JSON.stringify(process.env.SITE_URL ?? ""),
      },
    };
  },
});

const redirectRouteRules = Object.fromEntries(
  redirects.map(({ from, to }) => [
    from,
    { redirect: { to, status: REDIRECT_STATUS } },
  ]),
);

const buildRouteRules = {
  "/admin": { redirect: "/admin/index.html" },
  "/admin/**": { headers: { "X-Robots-Tag": "noindex" } },
};

const CMS_MANIFEST_PATH = "public/cms-manifest.json";

interface CmsManifest {
  collections: { name: string; slugs: string[] }[];
}

const readPagePaths = () => {
  const manifest: CmsManifest = JSON.parse(
    readFileSync(resolve(import.meta.dirname, CMS_MANIFEST_PATH), "utf8"),
  );
  const pages = manifest.collections.find(
    (collection) => collection.name === PAGE_COLLECTION_NAME,
  );
  return new Set((pages?.slugs ?? []).map(getPagePath));
};

// Kept as server assets rather than public files, because Nitro's static handler matches a file by path alone and would also answer the page's addresses that carry a query, which render on the server. The prerenderer is pointed at the build's public folder because its own preset defaults to `.output/public`, which a preset such as Vercel's never fills.
function prerenderPages(nitro: Nitro) {
  const pagesDir = resolve(nitro.options.buildDir, PRERENDERED_PAGES_ASSETS);
  const pagePaths = readPagePaths();
  nitro.options.serverAssets.push({
    baseName: PRERENDERED_PAGES_ASSETS,
    dir: pagesDir,
  });
  nitro.hooks.hook("prerender:config", (config) => {
    config.output = {
      ...config.output,
      publicDir: nitro.options.output.publicDir,
    };
  });
  nitro.hooks.hook("prerender:routes", async (routes) => {
    await rm(pagesDir, { recursive: true, force: true });
    for (const path of pagePaths) routes.add(path);
  });
  nitro.hooks.hook("prerender:generate", async (route) => {
    if (!pagePaths.has(route.route) || route.error || !route.contents) return;
    const file = resolve(pagesDir, toPrerenderedPageFile(route.route));
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, route.contents);
    route.skip = true;
  });
}

const buildNitroConfig = {
  modules: [prerenderPages],
  prerender: { failOnError: true },
};

export default defineConfig(({ command }) => ({
  server: {
    port: 5173,
    proxy: {
      "/admin": {
        target: "http://localhost:5174",
        ws: true,
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    include: ["@solidjs/start > @jridgewell/trace-mapping"],
  },
  plugins: [
    tailwindcss(),
    adminTrailingSlash(),
    serverEnv(),
    solidStart({ middleware: "src/middleware.ts" }),
    nitro({
      routeRules: {
        ...redirectRouteRules,
        ...(command === "build" ? buildRouteRules : {}),
      },
      ...(command === "build" ? buildNitroConfig : {}),
    }),
  ],
}));
