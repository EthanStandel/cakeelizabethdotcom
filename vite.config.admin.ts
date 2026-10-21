import { defineConfig, type Plugin } from "vite";
import { resolve } from "path";

const UNIST_PATCH = `\nexport {visitParents as default} from './lib/index.js';`;

const reloadOnConfigYml = (configYmlPath: string): Plugin => ({
  name: "reload-on-config-yml",
  configureServer(server) {
    server.watcher.add(configYmlPath);
    server.watcher.on("change", (file) => {
      if (file === configYmlPath) {
        server.ws.send({ type: "full-reload" });
      }
    });
  },
});

const appendUnistDefaultExport = {
  filter: {
    id: {
      include: /unist-util-visit-parents[/\\]index\.js/,
      exclude: /decap-cms-widget-markdown/,
    },
    code: "export {",
  },
  handler: (code: string) => ({ code: code + UNIST_PATCH, map: null }),
};

const fixMissingDefaultExports: Plugin = {
  name: "fix-missing-default-exports",
  config: () => ({
    optimizeDeps: {
      rolldownOptions: {
        plugins: [
          {
            name: "fix-missing-default-exports",
            transform: appendUnistDefaultExport,
          },
        ],
      },
    },
  }),
  transform: appendUnistDefaultExport,
};

export default defineConfig({
  root: resolve(import.meta.dirname, "admin"),
  base: "/admin/",
  publicDir: resolve(import.meta.dirname, "public/admin"),
  plugins: [
    reloadOnConfigYml(resolve(import.meta.dirname, "public/admin/config.yml")),
    fixMissingDefaultExports,
  ],
  resolve: {
    alias: { "~": resolve(import.meta.dirname, "src") },
  },
  server: {
    port: 5174,
    hmr: { clientPort: 5173, path: "/admin/" },
  },
  cacheDir: "node_modules/.vite-admin",
  build: {
    outDir: resolve(import.meta.dirname, "public/admin"),
    emptyOutDir: false,
  },
});
