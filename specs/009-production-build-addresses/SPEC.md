# 009 — production build addresses

| | |
| --- | --- |
| Status | Implemented |
| Depends on | [000](../000-initial/SPEC.md), [006](../006-not-found-page/SPEC.md), [007](../007-seo/SPEC.md), [008](../008-stable-solidstart/SPEC.md) |
| Snapshot | 2026-10-20, commit `a62a9a02b69c0a143ec94e5e9c9f90fa8a2414f2` |

## Description

Two addresses in a production build were wrong, both recorded as known gaps of [008](../008-stable-solidstart/SPEC.md#known-gaps) and both older than it. The built admin was written one directory too deep, so `/admin` redirected to a page that answered 404. And every build carried the dev server's address, `http://localhost:5173`, as the origin of its content fetches, because `.env.local` sets `VITE_SERVER_URL` to it ([000§4.2](../000-initial/SPEC.md#42-environment-variables)) and Vite inlines it into the client, server and admin bundles alike. A deploy would have rendered only while a dev server ran on the same machine.

This spec moves the admin page to the address the route rule names, and replaces the configured content origin with one taken from where the code runs, so no build depends on an environment value to find its own content. It also makes a render that fails answer promptly with the 500 status: a failed content fetch on the server had left the response open until the client gave up, which an outage of whatever serves the content files, a deploy missing `cms-manifest.json`, or a forged `Host` naming an unreachable server would all have caused.

## 1. Admin build output

`vite.config.admin.ts` uses `admin/` as its root while building as well as while serving. It was the repository root while building ([000§5](../000-initial/SPEC.md#5-build)), so that the input could be given as `admin/index.html`, and Vite writes an HTML input to the output directory at its path relative to the root, which put the page at `public/admin/admin/index.html`. With the root at `admin/`, the explicit input is removed and Vite builds the root's `index.html` by default, so the page is written to `public/admin/index.html`, where the build-only route rule `"/admin": { redirect: "/admin/index.html" }` ([008§2](../008-stable-solidstart/SPEC.md#2-server-build)) points. The rule is unchanged: `/admin` and `/admin/` answer 307 to `/admin/index.html`, which Nitro serves from `.output/public/admin/`.

`emptyOutDir` stays `false`, so `public/admin/config.yml`, which `generate:cms` writes before the admin build, survives it.

Three things follow from the one root:

- **The dev dependency scan.** While serving, the root was already `admin/`, and Vite resolved the build input `admin/index.html` against it, so the scan could not find its entry and skipped pre-bundling at startup. With no explicit input the scan takes the root's HTML files, finds `admin/index.html`, and pre-bundles `decap-cms-app` and its dependencies at startup.
- **Chunk names.** The entry chunk is named after the input, which was keyed `admin`, so the built files are now `index-*.js` and `index-*.css` under `public/admin/assets/` instead of `admin-*`.
- **Env files.** Vite reads env files from the root, so the admin bundle reads none in a build, as it already read none while serving. It reads no variable after [§2.4](#24-vite_server_url).

## 2. Content origin

`src/lib/content.ts` builds every content address from an origin that `getContentOrigin` chooses, in place of `VITE_SERVER_URL` ([000§7.1](../000-initial/SPEC.md#71-fetching)). The paths are unchanged: `/cms-manifest.json` and each collection folder with `public` stripped.

### 2.1 On the server

The server fetches from the origin of the request it is rendering, read from `getRequestEvent()` in `solid-js/web`. A fetch on the server needs an absolute address, which is why the variable could not be left empty: a relative `fetch("/cms-manifest.json")` on the server never resolved, and server rendering hung. The request's origin is the server's own address as the client reached it, so a deploy fetches from its own host (static files are served there by the same server or by the host's CDN), the dev server fetches from itself on port 5173, and a build checked on port 3100 fetches from port 3100. Fetching content outside a request throws, since there is no origin to use; nothing does at the snapshot.

The origin comes from the `Host` header; the server does not trust `X-Forwarded-Host`.

### 2.2 In the browser

The browser fetches same-origin, with the bare paths, so in-app navigation fetches from the address the visitor is on. The admin's preview `iframe` takes its `src` path as given for the same reason: the admin and the site share an origin ([GAC§11](../GLOBAL_ACCEPTANCE_CRITERIA.md)), in development through the `/admin` proxy ([000§4.1](../000-initial/SPEC.md#41-dev-servers-and-processes)) and in a build because Nitro serves both.

### 2.3 Manifest cache

In production the manifest is still cached for the life of the server process or browser session, but the cache records the origin it was fetched from and is read only for a request on the same origin. A request under another host name fetches the manifest again and replaces the entry. This keeps one request with a forged `Host` from putting another host's manifest in front of every later visitor, while holding no more than one manifest. In the browser the origin is always the empty string, so the cache behaves as before.

### 2.4 `VITE_SERVER_URL`

Nothing in the site or the admin reads `VITE_SERVER_URL` after this change, so the variable is removed from `.env.local` and `.env.example`. A value left in an untracked `.env` file or in the shell reaches no build.

## 3. Failed render

A render that fails answers promptly with the 500 status and an empty page. A failed content fetch is never shown as a missing page, with 404, and never hangs.

### 3.1 Cause of the hang

`getManifest` in `content.ts` throws when the manifest fetch fails, by a network error or a status other than OK, so every `getCollectionItem` and `getCollection` call rejects. The rejection reaches the `createAsync` behind each `createCmsContent` and `createContentFetch` ([000§7.2](../000-initial/SPEC.md#72-primitives)). On the server each `<Suspense>` catches its errored content and its fragment completes empty, so rendering itself finishes.

The response is ended only after the head is written. `@solidjs/meta` renders the head tags when the shell is assembled, after every fragment has completed, and outside any `<Suspense>`. `NotFound` ([006§3](../006-not-found-page/SPEC.md#3-the-view)) wrote `<Title>{content()?.title}</Title>` with no guard, and the page route shows `NotFound` while a page's content is pending, so on any page the head held a title that read content which had since failed. Reading it threw again. That throw escaped Solid's stream renderer as an unhandled rejection, so the render was never marked complete, and with the handler in `mode: "async"` ([000§10](../000-initial/SPEC.md#10-site-shell-and-routes)) SolidStart waits for the complete render with no timeout.

### 3.2 Error boundary

`src/app.tsx` wraps everything inside `MetaProvider` in an `ErrorBoundary`: the constants and navigation providers, the header, the routed page, the footer and the modals. Its fallback sets the status with `HttpStatusCode` and the number 500, written in `app.tsx` as `NOT_FOUND_STATUS` is in `NotFound`, and logs the error with `console.error`.

On the server the error a `<Suspense>` catches is rethrown to the nearest boundary. The boundary replaces its whole region of the markup with the fallback before the shell is written, cleaning the region first, so the 404 status that `NotFound` set while the page was pending is reset and the 500 replaces it. The response then ends like any other.

The boundary catches every error thrown while rendering, not only failed fetches, so a component that throws also answers 500 rather than SolidStart's own error response.

### 3.3 The view

The fallback renders nothing but the status: the page has no header, footer, heading or title. Every perceivable string comes from content ([GAC§1](../GLOBAL_ACCEPTANCE_CRITERIA.md)), and content is what failed, so there is nothing the view could show that is not written into a component. A partial page is not drawn either: the header and footer fetch the constants and the navigation from the same manifest as the page, so when one fails, they all do.

### 3.4 What counts as a failure

A failure is any rejection of a content fetch: a manifest fetch that errors or answers with a status other than OK, an entry fetch that errors, and an entry whose JSON or schema does not parse. An entry the manifest does not list, or one whose fetch answers with a status other than OK, is still a miss and not a failure: `getCollectionItem` returns `undefined`, and the page route shows `NotFound` with 404 ([006§4](../006-not-found-page/SPEC.md#4-routes)).

### 3.5 In the browser

The server serializes the caught error, so the browser hydrates the fallback rather than the page. A content fetch that fails during a navigation in the app is caught by the same boundary, and the browser shows the empty view instead of throwing past the router.

### 3.6 Head tags read resolved content

A head tag that reads content renders inside a `<Show>` on that content, so it is created only once the content has loaded, and never reads content that is pending or has failed. `NotFound` renders its `<Title>` inside `<Show when={content()}>`; the page route's `<Title>` was already inside the `<Show>` that waits for the page. With no title reading failed content, building the head cannot throw.

`NotFound`'s tab title is unchanged while the entry loads: it was an empty `<title>` and is now no `<title>`, which a browser shows the same way.

## 4. Checking a build

`SKIP_ENV_CHECK=true CMS_GITHUB_REPO=ethanstandel/cakeelizabethdotcom npm run build` gives a build that the `production-build` configuration of [007§7](../007-seo/SPEC.md#7-production-server) serves on its own: `/admin` redirects to the admin page, which answers 200, and pages render on the server and navigate in the app with the dev server stopped. The override of port 3100 that 008's known gaps describe is no longer needed. No file under `.output/` names `localhost:5173`.

Served with `PORT=3101 NO_MAIL=true node .output/server/index.mjs`, a request with `Host: localhost:1`, which no server answers, answers 500 at once, and so does a copy of `.output/` with `public/cms-manifest.json` deleted, on its own host ([§3](#3-failed-render)). Every page renders with its usual status, the not-found address with 404.

## Known gaps

- **A forged `Host` makes the server fetch from that host.** A request whose `Host` names another server renders that server's `/cms-manifest.json` and content JSON into its own response. One whose host cannot be reached answers 500 ([§3](#3-failed-render)). It cannot affect other visitors ([§2.3](#23-manifest-cache)). A host that routes by domain, as Vercel does, does not deliver such a request; the bare `node-server` output on a public port does.
- **Old admin bundles pile up in `public/admin/assets/`.** `emptyOutDir: false` keeps the previous builds' hashed files along with `config.yml`, and each is about 5 MB. The build copies all of them into `.output/public/admin/assets/`, though `index.html` references only the newest.
- **An entry file that fails to load renders as not found.** When the manifest lists a slug and the entry's fetch answers with a status other than OK, the address shows `NotFound` with 404 instead of 500 ([§3.4](#34-what-counts-as-a-failure)).
- **The empty view stays until a reload.** In the browser the error boundary is never reset, so after a fetch fails during navigation the Back button and later navigations still show the empty view; only reloading the page renders it again.
- **A failed page carries the server's stack.** The server serializes each failed content resource into the page for hydration, and the error is serialized with its stack, so the 500 page holds the server's file paths. Nothing on the client awaits those resources once the fallback is shown, so the browser also logs each as an uncaught rejection.
