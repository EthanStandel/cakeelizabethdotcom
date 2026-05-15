import { defineConfig, type Plugin } from "vite";
import { resolve } from "path";

const fixMissingDefaultExports: Plugin = {
  name: "fix-missing-default-exports",
  transform(code, id) {
    if (
      id.includes("/unist-util-visit-parents/index.js") &&
      !id.includes("decap-cms-widget-markdown") &&
      code.includes("export {")
    ) {
      return {
        code: `${code}\nexport {visitParents as default} from './lib/index.js';`,
        map: null,
      };
    }
  },
};

export default defineConfig({
  plugins: [fixMissingDefaultExports],
  resolve: {
    alias: { "~": resolve(__dirname, "src") },
  },
  build: {
    outDir: "public",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        admin: "admin/index.html",
      },
    },
  },
});
