# 010 — prerendered pages

| | |
| --- | --- |
| Status | Implemented |
| Depends on | [000](../000-initial/SPEC.md), [006](../006-not-found-page/SPEC.md), [007](../007-seo/SPEC.md), [008](../008-stable-solidstart/SPEC.md), [009](../009-production-build-addresses/SPEC.md) |
| Snapshot | 2026-10-20, commit `a62a9a02b69c0a143ec94e5e9c9f90fa8a2414f2` |

## Description

A production build renders every request on the server ([000§1](../000-initial/SPEC.md#1-purpose-and-shape-of-the-project)), though the content cannot change between builds: it is generated into `public/` by `generate:cms` and served as static files ([000§7.1](../000-initial/SPEC.md#71-fetching)). Only the manifest is cached, so each visit to a page renders it again and fetches its entries again.

This spec renders every page entry once, while the site is built, and serves the stored result to every request for that page's address. A request that carries URL state still renders on the server, and nothing changes in development. The admin's preview still receives drafts in a build, because a stored page is the markup the server would have rendered and hydrates like it.

## 1. Which pages

Every entry of the `page` collection is rendered at its address, `getPagePath(slug)`: the home entry at `/`, every other entry at `/<slug>`. Nothing else is: not `/home`, which redirects to `/`; not `/404`, the not-found view's reserved address ([006§5](../006-not-found-page/SPEC.md#5-reserved-address)); not `robots.txt`, whose answer depends on the request's host ([007§4.1](../007-seo/SPEC.md#41-robotstxt)); and not the sitemap, the contact form's endpoint, or the admin.

The list is read from `public/cms-manifest.json`, which `generate:cms` writes in `prebuild`, before `vite build` runs ([000§5](../000-initial/SPEC.md#5-build)). It is not read from `src/models/`, because `vite.config.ts` cannot import the models: they import through the `~` alias, which Vite's config loader does not resolve. The collection's name, the home entry's slug and address, and `getPagePath` move from `src/models/Page.shape.ts` into `src/lib/pagePaths.ts`, a module with no imports that the config can read, as it reads `src/lib/redirects.ts` ([007§5.1](../007-seo/SPEC.md#51-where-they-live)). `Page.shape.ts` takes the collection's name from it and exports the rest again, so no other import changes.

## 2. Rendering at build time

Nitro renders the pages after it has built the client and the server and copied `public/` into `.output/public/` ([008§2](../008-stable-solidstart/SPEC.md#2-server-build)). A Nitro module in `vite.config.ts`, `prerenderPages`, adds each address of [§1](#1-which-pages) through the `prerender:routes` hook, and `prerender.failOnError` is on, so a page that does not render with status 200 fails the build. Links are not crawled: the list is the content's, and crawling would also render every gallery address with a query.

### 2.1 Content during the build

Nitro renders each page by handing a request to a copy of the server inside the build process. Nothing listens on a port, and the request's address is `http://localhost/<path>`, so the content origin of [009§2.1](../009-production-build-addresses/SPEC.md#21-on-the-server), the request's own, reaches no server.

Nitro marks each of these requests with an `x-nitro-prerender` header. For a request that carries it, the middleware in `src/middleware.ts` gives the request event a `contentFetch` local: `serverFetch` from `nitro/app`, which passes a request to the Nitro app in the same process, where the public files are served. `getManifest` and `getCollectionItem` in `src/lib/content.ts` fetch through the local when it is set and through the global `fetch` otherwise, with the same addresses. Every other request on the server keeps the request's origin, and the browser keeps fetching same-origin.

### 2.2 What is fixed at build time

A stored page holds what the server read while building: the content, which `generate:cms` had already fixed for the build, and `SITE_URL`, which `validate:env` requires of a build ([007§2](../007-seo/SPEC.md#2-site-origin)) and which the canonical link, the social card and the structured data are built from. A server started with another `SITE_URL` serves the stored pages with the build's.

## 3. Serving

### 3.1 Where the pages are kept

The rendered pages are not written to `.output/public/`. Nitro's static handler runs before the app and finds a file by the request's path alone, so a page stored there would be the answer to `/gallery?modal=…` and `/gallery?galleryFilterTag=…` too. Those addresses are URL state, which renders on the server ([GAC§7](../GLOBAL_ACCEPTANCE_CRITERIA.md)): the open modal, the filtered gallery, and the shared modal's social card ([007§3.4](../007-seo/SPEC.md#34-social-card)), which a link preview reads without running scripts.

The `prerender:generate` hook writes each page instead into a directory of Nitro's build directory, as `index.html` for `/` and `<slug>.html` for `/<slug>`, and marks the route skipped so that Nitro does not also write it to the public folder. The directory is registered as the server assets `prerendered-pages`, which Nitro bundles into the server when it builds it, after the pages are rendered. They are not reachable at any address. The directory is emptied when the build's route list is made, so a page removed from the content leaves nothing behind. The names and the file-name rule are in `src/lib/prerenderedPages.ts`, which the config and the middleware share.

### 3.2 The answer

The middleware answers a `GET` or `HEAD` request that has no query from the stored page for its path, with status 200 and `text/html`, before the app renders anything. It runs after the path normalization of [007§5.3](../007-seo/SPEC.md#53-normalization), so `/about/` is still redirected to `/about` first, and the redirect table's route rules run before both. A path with no stored page, any query, any other method, and every request during the build go on to the app as before. Any query includes ones the site does not read, such as a campaign's `utm_` parameters, so those addresses render on the server too.

In development the build directory has no such assets, so every request renders as before ([000§7.2](../000-initial/SPEC.md#72-primitives)).

## 4. Admin preview

The admin is served by the same server in a build ([009§1](../009-production-build-addresses/SPEC.md#1-admin-build-output)), and its preview frame loads page addresses without a query, so it is shown stored pages. A stored page is the server's markup with the server's data serialized into it, so it hydrates, and `setupCmsPreview` and `createCmsLiveContent` run in the frame as they do on a page rendered per request ([000§8.4](../000-initial/SPEC.md#84-preview-side-behavior), [000§9.4](../000-initial/SPEC.md#94-live-preview-flow)). The admin's `cms-preview-update` messages replace the stored content in the frame on every edit, and clicks reach the editor through `cms-field-focus`, since every `data-cms-*` attribute is in the stored markup. An entry created in the admin and not yet built has no stored page, so its address renders on the server, as every page did before.

## 5. Checking a build

`SKIP_ENV_CHECK=true SITE_URL=http://localhost:3100 CMS_GITHUB_REPO=ethanstandel/cakeelizabethdotcom npm run build` lists each page's address under "Prerendering 6 routes" as skipped, and then reports 0 routes prerendered, since Nitro counts only the files it writes to the public folder. The pages are in `node_modules/.nitro/prerendered-pages/`, bundled into `.output/server/_virtual/`, and `.output/public/` holds no page HTML apart from the admin's.

Served by the `production-build` configuration of [007§7](../007-seo/SPEC.md#7-production-server):

- Each page's address answers 200 with its stored file, byte for byte.
- A request with `Host: localhost:1`, whose content cannot be fetched ([009§4](../009-production-build-addresses/SPEC.md#4-checking-a-build)), still answers 200 at a page's address, which shows that nothing is rendered, and answers 500 at the same address with a query, which shows that it is rendered.
- A gallery modal address carries its item's social card, `/about/` and `/home` answer 301, and `/404` answers 404.
- A stored page loaded in a frame marks its body `cms-preview`, replaces a module's field with the value of a `cms-preview-update` message, and sends `cms-field-focus` with the field's path to the top window when that field is clicked, with no errors in the console.
