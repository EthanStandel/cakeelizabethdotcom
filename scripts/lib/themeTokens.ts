import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";

const APP_CSS_PATH = resolve(import.meta.dirname, "../../src/app.css");

const THEME_TOKENS = {
  __THEME_CONTAINER_DSK_PX__: { property: "--container-dsk", unit: "px" },
  __THEME_DEFAULT_TRANSITION_DURATION_MS__: {
    property: "--default-transition-duration",
    unit: "ms",
  },
} as const;

// Throws when a token is missing or carries a different unit, so a renamed or
// rewritten token fails the build instead of silently drifting.
const readThemeTokenDefines = () => {
  const appCss = readFileSync(APP_CSS_PATH, "utf8");
  return Object.fromEntries(
    Object.entries(THEME_TOKENS).map(([define, { property, unit }]) => {
      const match = appCss.match(
        new RegExp(`${property}:\\s*([\\d.]+)${unit}\\s*;`),
      );
      if (!match) {
        throw new Error(`${property} has no ${unit} value in src/app.css`);
      }
      return [define, match[1]];
    }),
  );
};

// Restarts the dev server only when an edit to app.css changes a token value,
// since a define is fixed for the lifetime of the server.
export const themeTokens = (): Plugin => {
  let defines: Record<string, string>;
  return {
    name: "theme-tokens",
    config() {
      defines = readThemeTokenDefines();
      return { define: defines };
    },
    configureServer(server) {
      server.watcher.add(APP_CSS_PATH);
      server.watcher.on("change", (file) => {
        if (file !== APP_CSS_PATH) return;
        const next = readThemeTokenDefines();
        const changed = Object.keys(next).some(
          (define) => next[define] !== defines[define],
        );
        if (changed) server.restart();
      });
    },
  };
};
