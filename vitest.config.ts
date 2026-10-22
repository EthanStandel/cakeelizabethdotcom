import { resolve } from "node:path";
import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import tailwindcss from "@tailwindcss/vite";
import solid from "vite-plugin-solid";
import { themeTokens } from "./scripts/lib/themeTokens";

const SCREENSHOT_DIRECTORY = "__screenshots__";

export default defineConfig({
  plugins: [tailwindcss(), themeTokens(), solid()],
  resolve: { alias: { "~": resolve(import.meta.dirname, "src") } },
  test: {
    include: ["src/**/*.test.tsx"],
    environment: "node",
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({
        contextOptions: { reducedMotion: "reduce" },
      }),
      instances: [
        {
          browser: "chromium",
          name: "desktop",
          viewport: { width: 1280, height: 900 },
        },
        {
          browser: "chromium",
          name: "mobile",
          viewport: { width: 390, height: 844 },
        },
      ],
      expect: {
        toMatchScreenshot: {
          screenshotOptions: { animations: "disabled", caret: "hide" },
          resolveScreenshotPath: ({
            root,
            testFileDirectory,
            arg,
            project,
            platform,
            ext,
          }) =>
            resolve(
              root,
              testFileDirectory,
              SCREENSHOT_DIRECTORY,
              `${arg}-${project.name}-${platform}${ext}`,
            ),
        },
      },
    },
  },
});
