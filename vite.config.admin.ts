import { defineConfig, type Plugin } from "vite";
import { resolve } from "path";
import { readFileSync } from "fs";

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

const fixMissingDefaultExports: Plugin = {
  name: "fix-missing-default-exports",
  config: () => ({
    optimizeDeps: {
      esbuildOptions: {
        plugins: [
          {
            name: "fix-unist-default-esbuild",
            setup(build) {
              build.onLoad(
                { filter: /unist-util-visit-parents[/\\]index\.js$/ },
                (args) => {
                  const contents = readFileSync(args.path, "utf8");
                  if (!contents.includes("export {")) return undefined;
                  return { contents: contents + UNIST_PATCH, loader: "js" };
                }
              );
            },
          },
        ],
      },
    },
  }),
  transform(code, id) {
    if (
      id.includes("/unist-util-visit-parents/index.js") &&
      !id.includes("decap-cms-widget-markdown") &&
      code.includes("export {")
    ) {
      return { code: code + UNIST_PATCH, map: null };
    }
  },
};

export default defineConfig(({ command }) => ({
  root: command === "serve" ? resolve(__dirname, "admin") : __dirname,
  base: "/admin/",
  publicDir: resolve(__dirname, "public/admin"),
  plugins: [
    reloadOnConfigYml(resolve(__dirname, "public/admin/config.yml")),
    fixMissingDefaultExports,
  ],
  resolve: {
    alias: { "~": resolve(__dirname, "src") },
  },
  server: {
    port: 5174,
    hmr: { clientPort: 5173 },
  },
  build: {
    outDir: resolve(__dirname, "public/admin"),
    emptyOutDir: false,
    rollupOptions: {
      input: {
        admin: "admin/index.html",
      },
    },
  },
}));
