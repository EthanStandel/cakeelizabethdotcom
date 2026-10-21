# 008 — stable SolidStart

| | |
| --- | --- |
| Status | Implemented |
| Depends on | [000](../000-initial/SPEC.md), [007](../007-seo/SPEC.md) |
| Snapshot | 2026-10-15, commit `a62a9a02b69c0a143ec94e5e9c9f90fa8a2414f2` |

## Description

The rewrite was scaffolded on `@solidjs/start` 2.0.0-alpha.2, when SolidStart 2 still ran on Vite 7 and reached Nitro 2 through `@solidjs/vite-plugin-nitro-2` ([000§2](../000-initial/SPEC.md#2-toolchain)). That bridge put h3 1 and h3 2 in one server build, and the production server answered 500 to every request until [007§7](../007-seo/SPEC.md#7-production-server) patched the module resolution of its generated entry. SolidStart 2.0 has since gone stable, paired with Vite 8, Rolldown and Nitro 3, where Nitro and SolidStart both run on h3 2.

This spec moves the repository to the stack the official template uses (`solid-start-v2/basic` in `solidjs/templates`): the stable packages, Nitro 3 through its own Vite plugin, and the Rolldown equivalents of the admin bundle's esbuild options. It changes no behavior a visitor or an editor sees.

## 1. Versions

| Package | Before | After |
| --- | --- | --- |
| `@solidjs/start` | 2.0.0-alpha.2 | ^2.0.6 |
| `@solidjs/router` | ^0.15.0 (0.15.4) | ^1.0.0 |
| `vite` | ^7.0.0 (7.3.3) | ^8.3.4 |
| `@solidjs/vite-plugin-nitro-2` | ^0.1.0 | removed |
| `nitro` | — | ^3.0.260903-beta |

`nitro` has no stable 3.0 release; its `latest` tag is a dated beta, which the template also pins. Vite 8 builds with Rolldown and pre-bundles dependencies with Rolldown, so esbuild options no longer reach either step ([§3](#3-admin-bundle)).

Router 1.0 is a version realignment of the 0.16 line and changes no API, so no route or component changed. Two of its 0.16 fixes alter behavior the site can observe: consecutive synchronous `setSearchParams` calls now compose instead of each starting from the committed location, and a path with an empty interior segment (`/a//b`) renders the not-found view instead of matching its collapsed form.

`package.json` takes two more settings from the template. `engines.node` is `>=24`, which SolidStart 2.0 requires. `start` is `node .output/server/index.mjs`; it was `vite start`, a command that does not exist.

## 2. Server build

`vite.config.ts` imports `nitro` from `nitro/vite` in place of `nitroV2Plugin`. The plugin takes Nitro's configuration directly, and no preset is set, so the output is still the `node-server` build in `.output/` with `.output/server/index.mjs` as its entry.

The workaround of [007§7](../007-seo/SPEC.md#7-production-server) is removed: the `nitroEntryH3` Rollup plugin, the `rollup:before` hook that installed it, and the `NITRO_ENTRY_ID` and `NITRO_PACKAGE_PATH` constants. Nitro 3 runs on h3 2 like SolidStart, and since 2.0.0-beta.3 SolidStart bundles its own h3 into server builds, so the server entry cannot be handed events of another h3 version.

The admin's build-only route rules stay ([000§5](../000-initial/SPEC.md#5-build)), as one rule. Nitro 3 matches routes with `rou3`, which treats `/admin` and `/admin/` as the same path, and it refuses to merge two rules for one path at build time, so `"/admin": { redirect: "/admin/index.html" }` now serves both. A redirect given as a bare string still answers 307.

In Nitro 3 a route rule's redirect object is `{ to, status }`. The `statusCode` key that [007§5.1](../007-seo/SPEC.md#51-where-they-live) names for the redirect table is Nitro 2's.

## 3. Dev server

Nitro 3's Vite plugin runs the dev server's requests through Nitro too, which Nitro 2's bridge did not. Three settings in `vite.config.ts` follow from it.

- **Port.** Nitro sets the dev server's port to 3000 unless `PORT` or `server.port` is given, so `server.port` is 5173, the port [000§4.1](../000-initial/SPEC.md#41-dev-servers-and-processes) gives the app and the admin's `hmr.clientPort` points at.
- **The admin proxy.** Nitro's dev middleware is installed ahead of Vite's own, so it answered `/admin/` with the not-found view before the request reached the `/admin` proxy. It leaves alone any path that another middleware is mounted on, so `adminTrailingSlash` is now mounted at `/admin` and compares the request's `originalUrl`, since a mounted middleware sees the path with the mount stripped. The proxy then receives `/admin/` and everything under it as before. The mount does not cover `/administrator`, which is now the app's not-found view instead of the admin server's 404.
- **The dev toolbar.** SolidStart 2 adds a dev toolbar whose error viewer imports `@jridgewell/trace-mapping`, which imports `@jridgewell/resolve-uri`. Under the `browser` condition that package resolves to its UMD build, which the browser cannot import as a module, and SolidStart is not pre-bundled, so every page logged a failed import. `optimizeDeps.include` lists `@solidjs/start > @jridgewell/trace-mapping` so that it is pre-bundled with its dependency.

## 4. Admin bundle

`vite.config.admin.ts` keeps its two plugins ([000§5](../000-initial/SPEC.md#5-build)).

`fixMissingDefaultExports` registered an esbuild plugin under `optimizeDeps.esbuildOptions`, which Vite 8 deprecates and whose plugins it does not run. It now registers a Rolldown plugin under `optimizeDeps.rolldownOptions`. The pre-bundling plugin and the plugin's own `transform` share one hook object, whose filter selects `unist-util-visit-parents/index.js` files containing `export {` outside `decap-cms-widget-markdown`, and whose handler appends the default export. The pre-bundling step used to read every copy's file itself and skip the ones without `export {`; the filter does the same selection before the handler runs. `decap-cms-widget-markdown`'s own copy is CommonJS, so excluding it in pre-bundling changes nothing. At the snapshot the build patches one copy, the root `unist-util-visit-parents` 6, and the admin's pre-bundled dependencies reach no copy the filter selects.

`build.rollupOptions` is `build.rolldownOptions`, the name Vite 8 gives it. `__dirname` is `import.meta.dirname`, because Vite 8 warns that `__dirname` will not work under its native config loader, which it plans to make the default.

## Known gaps

- **The built admin's address answers 404.** The admin build's root is the repository root, so its `admin/index.html` input is written to `public/admin/admin/index.html`, and the route rule's target `/admin/index.html` does not exist. `/admin` answers 307 to an address that answers 404. This predates the upgrade: the output path does not depend on the Vite version.
- **The admin's dependency scan fails in development.** While serving, the admin's root is `admin/`, and Vite resolves the build input `admin/index.html` against it, so the scan logs that it cannot resolve the input and skips pre-bundling at startup; dependencies are then pre-bundled as they are first requested. Vite 7 resolved the input the same way.
- **A local build fetches content from the dev server.** `.env.local` sets `VITE_SERVER_URL` to `http://localhost:5173` ([000§4.2](../000-initial/SPEC.md#42-environment-variables)), and a build reads it, so the `production-build` configuration of [007§7](../007-seo/SPEC.md#7-production-server) renders on the server only while the dev server is running, and its in-app navigations fail on cross-origin fetches. The server needs an absolute address, so the value cannot be left empty; a build checked on port 3100 is built with `VITE_SERVER_URL=http://localhost:3100`.
- **The Nitro build step sometimes stalls.** Two of nine builds during the upgrade spent 5 and 16 minutes in the `nitro` environment step, which otherwise takes about a second, and then finished with correct output. Neither the content address nor machine load explained it, and it did not recur.
