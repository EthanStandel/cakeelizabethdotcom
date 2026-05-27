import { defineConfig, type Plugin } from "vite";
import { nitroV2Plugin as nitro } from "@solidjs/vite-plugin-nitro-2";
import tailwindcss from "@tailwindcss/vite";
import { solidStart } from "@solidjs/start/config";

const adminTrailingSlash = (): Plugin => ({
  name: "admin-trailing-slash",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === "/admin") {
        res.writeHead(301, { Location: "/admin/" });
        res.end();
      } else {
        next();
      }
    });
  },
});

export default defineConfig(({ command }) => ({
  server: {
    watch: {
      usePolling: true,
      interval: 500,
    },
    proxy: {
      "/admin": {
        target: "http://localhost:5174",
        ws: true,
        changeOrigin: true,
      },
    },
  },
  plugins: [
    tailwindcss(),
    adminTrailingSlash(),
    solidStart(),
    nitro({
      routeRules:
        command === "build"
          ? {
              "/admin": { redirect: "/admin/index.html" },
              "/admin/": { redirect: "/admin/index.html" },
            }
          : {},
    }),
  ],
}));
