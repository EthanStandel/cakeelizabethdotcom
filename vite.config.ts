import { defineConfig, loadEnv, type Plugin } from "vite";
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

const SERVER_ENV_PREFIXES = ["MAIL_", "NO_MAIL"];

// Vite exposes env files only on import.meta.env, so the server-only mail variables are copied to process.env; loadEnv already lets the shell's value win.
const serverEnv = (): Plugin => ({
  name: "server-env",
  config(_config, { mode }) {
    Object.assign(
      process.env,
      loadEnv(mode, process.cwd(), SERVER_ENV_PREFIXES),
    );
  },
});

export default defineConfig(({ command }) => ({
  server: {
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
    serverEnv(),
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
