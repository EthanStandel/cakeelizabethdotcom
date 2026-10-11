# 000 — initial architecture & environment

|            |                                                               |
| ---------- | ------------------------------------------------------------- |
| Status     | Implemented                                                   |
| Depends on | none                                                          |
| Snapshot   | 2026-10-06, commit `45d956beae9ea4dd1dfea7895b035baf9c62a88d` |

## Description

This is the root of the spec tree. It records every decision made in the repository up to the snapshot: the toolchain and development environment, the single-source-of-truth content model, the Decap CMS integration and its customized admin, the site shell and design tokens, the page modules, and the gallery and its modal. The content itself is not part of the spec: entries are authored through the CMS during build-out and are not engineering decisions. Later specs build on this one and describe only what they add or change.

## 1. Purpose and shape of the project

cakeelizabeth.com is the marketing site for Cake Elizabeth, a custom cake studio in Maine. The repository is a ground-up rewrite on the `rewrite/solidstart/3.0.0` branch; the history before `199f7ed init: npm create solid` belongs to the previous TinaCMS-based site and is kept only for continuity.

Three decisions define the rewrite:

1. **The site is a SolidStart application rendered on the server.** Routes, components, and content access live in `src/`.
2. **Content is Markdown with YAML front matter, committed to the repository, and edited through Decap CMS.** There is no content database. The admin is a separately bundled Decap instance in `admin/` that is proxied through the main server, with a live preview of the real site and click-to-edit from the preview back into the editor.
3. **The content model is defined once, in TypeScript.** Collection definitions in `src/models/` drive the generated Decap configuration, build-time validation of every content file, and the typed content fetchers used by the site. The admin bundle imports the same model files.

## 2. Toolchain

| Package                                         | Version              | Role                                                                          |
| ----------------------------------------------- | -------------------- | ----------------------------------------------------------------------------- |
| `solid-js`                                      | 1.9.12               | UI runtime                                                                    |
| `@solidjs/start`                                | 2.0.0-alpha.2        | SSR framework; file routes under `src/routes/`                                |
| `@solidjs/router`                               | 0.15.4               | Routing, `query`/`createAsync`, search params                                 |
| `@solidjs/meta`                                 | 0.29.x               | `<Title>`                                                                     |
| `@solidjs/vite-plugin-nitro-2`                  | 0.1.x                | Nitro server build; no preset configured, so the default `node-server` output |
| `vite`                                          | 7.3.3                | Build tool for both bundles                                                   |
| `tailwindcss`, `@tailwindcss/vite`              | 4.3.0                | Styling; configured entirely in CSS (`@theme`, `@utility`, `@custom-variant`) |
| `cva` (alias of `class-variance-authority`)     | 0.7.1                | `cx` for class composition                                                    |
| `zod`                                           | 4.4.3                | Schema for every collection and for URL query-parameter state                 |
| `decap-cms-app`                                 | 3.12.2               | CMS admin UI; React is used only as its transitive dependency                 |
| `decap-server`                                  | 3.7.0 (dev)          | Local Git-backed proxy so dev edits write to disk                             |
| `gray-matter`, `js-yaml`                        | 4.x, 4.x             | Front-matter parsing and `config.yml` emission in `scripts/`                  |
| `marked`                                        | 18.x                 | Markdown to HTML for `markdown` fields                                        |
| `lodash` (`get`)                                | 4.x                  | Property lookup in `Content`                                                  |
| `lucide-solid`                                  | 1.17.x               | Icons (`X`, `ChevronLeft`, `ChevronRight`, `Mail`)                            |
| `tsx`, `concurrently`, `prettier`, `typescript` | 4.x, 9.x, 3.x, 6.0.3 | Script runner, dev process manager, formatting (default config), types        |

Node 22 or newer is required (`engines`); the host used for this snapshot runs Node 24.

Three TypeScript projects exist. `tsconfig.json` covers `src/` with `jsx: preserve` and `jsxImportSource: solid-js`, and maps `~/*` to `src/*`. `admin/tsconfig.json` covers `admin/` with `jsx: react-jsx` and the same `~` alias pointing at `../src`. `scripts/tsconfig.json` covers the Node scripts. Nothing is emitted; `tsx` and Vite compile on the fly.

Editor tooling: `.mcp.json` registers the Playwright MCP server and `.vscode/launch.json` holds the debugger attach configuration ([§4.1](#41-dev-servers-and-processes)).

## 3. Repository layout

```
admin/                 Decap CMS bundle (React, own Vite config)
  components/          BrowserNavBar, PreviewFrame, Rulers
  hooks/               useLocalStorageState, useMessageHandler, useNavigationHistory
public/
  content/             Page entries (*.md) and one folder per non-page collection
  fonts/               Self-hosted Old Standard TT and Montserrat
  images/              Media library (Decap media_folder)
  admin/               Generated: admin build output and config.yml (gitignored)
  cms-manifest.json    Generated (gitignored)
scripts/               generate-cms-config.ts, validate-content.ts
specs/                 Feature specs
src/
  assets/fonts/        @font-face declarations
  components/          Reusable UI; modals/ holds the modal system
  lib/cms/             Model builders, types, message protocol, path context
  lib/content.ts       Typed content fetchers
  lib/utils/           Shared helpers
  models/              Collection definitions; modules/ and components/ hold sub-shapes
  modules/             Page-section components and ModuleRegistry
  primitives/          Solid primitives: content fetch, live preview, constants context
  routes/              File routes
```

`.gitignore` excludes the build outputs (`.output`, `dist`, `.nitro`), `.env`, `node_modules` in both the root and `admin/`, everything generated into `public/admin/` and `public/content/**/*.json`, `public/cms-manifest.json`, `.playwright-mcp/`, `.vscode`, `notes.md`, and `memory`.

## 4. Local development

Development runs directly on the host with `npm install` and `npm run dev`; there is no container or VM layer.

### 4.1 Dev servers and processes

`npm run dev` first runs `predev` (`generate:cms:dev`, [§6.7](#67-generated-artifacts)) and then starts four processes through `concurrently`, with the `DECAP` process's output hidden:

| Name   | Command                                            | Port | Purpose                                                                     |
| ------ | -------------------------------------------------- | ---- | --------------------------------------------------------------------------- |
| CLIENT | `NODE_OPTIONS=--inspect vite dev`                  | 5173 | SolidStart app; proxies `/admin`; inspector on 9229                         |
| ADMIN  | `vite dev --config vite.config.admin.ts`           | 5174 | Decap bundle with HMR                                                       |
| DECAP  | `decap-server`                                     | 8081 | Local Git backend proxy used by Decap's `local_backend`                     |
| CMS    | `tsx scripts/generate-cms-config.ts --dev --watch` | —    | Regenerates `config.yml`, per-entry JSON, and the manifest on `.md` changes |

`vite.config.ts` proxies `/admin` (HTTP and WebSocket) to port 5174 and redirects a bare `/admin` to `/admin/` with a 301 so Vite does not print its public-base-URL notice. The admin server sets `hmr.clientPort: 5173` and `hmr.path: "/admin/"` so the browser opens its HMR socket back through the proxy.

The admin bundle's dependency cache is `node_modules/.vite-admin`, separate from the main bundle's `.vite`, because sharing one cache caused startup errors.

Debugging: the VS Code configuration "Attach to Vite" attaches to port 9229 with `restart: true`, so it reconnects after Vite restarts. Server-side breakpoints work there; client code is debugged in browser DevTools.

### 4.2 Environment variables

`.env` is gitignored; `.env.local` is committed and read by Vite:

```
VITE_SERVER_URL=http://localhost:5173
CMS_GITHUB_REPO=cakeelizabethdotcom
CMS_GITHUB_BRANCH=main
```

`VITE_SERVER_URL` is prepended to every content fetch URL and every preview iframe `src`, so the admin can reach the site when the two are not same-origin. It defaults to the empty string (same-origin). `CMS_GITHUB_REPO` and `CMS_GITHUB_BRANCH` are read by the production config generator ([§6.7](#67-generated-artifacts)); they are only read from `process.env`, which `tsx` does not populate from env files. A production build therefore needs `CMS_GITHUB_REPO` exported in the shell that runs it, in the `owner/repo` form Decap's `github` backend expects; `CMS_GITHUB_BRANCH` falls back to `main`.

## 5. Build

`npm run build` runs, in order:

1. `prebuild`: `generate:cms` (production `config.yml`, JSON, manifest) → `build:admin` → `validate:content` ([§6.8](#68-validation); fails the build on any schema violation).
2. `build`: `vite build` (SolidStart + Nitro into `.output/`) → `vite build --config vite.config.admin.ts` (the admin bundle again, into `public/admin/`).

| Config                 | Entry              | Output          | Notes                                                                                   |
| ---------------------- | ------------------ | --------------- | --------------------------------------------------------------------------------------- |
| `vite.config.ts`       | SolidStart app     | `.output/`      | Nitro route rules redirect `/admin` and `/admin/` to `/admin/index.html` in builds only |
| `vite.config.admin.ts` | `admin/index.html` | `public/admin/` | `base: /admin/`; `emptyOutDir: false` so the generated `config.yml` survives            |

The admin config's `root` is `admin/` while serving and the repository root while building, so that dev serves `index.html` at `/admin/` and the build can reference `admin/index.html` as its input. It resolves `~` to `src/` so the bundle imports the model files directly.

Two plugins are specific to the admin bundle. `reloadOnConfigYml` watches `public/admin/config.yml` and sends a full reload when it changes, so model edits reach the editor without restarting. `fixMissingDefaultExports` appends a default export to `unist-util-visit-parents` (both in esbuild dependency pre-bundling and in the transform step, excluding `decap-cms-widget-markdown`'s own copy), working around a package that Decap's markdown widget imports as a default export but that only exposes named exports.

## 6. Content model

### 6.1 Field builders

`src/lib/cms/define.ts` exports `fields` and `defineCollection`. Every builder returns a `CmsField`: a Zod schema paired with a Decap field config (without `name`, which is assigned when the field is placed in a map). Each builder takes a `label` and an optional `required` (default `true`); `required: false` wraps the Zod schema in `.optional()` and sets `required: false` on the widget.

| Builder               | Decap widget                                              | Zod schema                                              | Extra options                                                                                   |
| --------------------- | --------------------------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `string`, `text`      | `string`, `text`                                          | `z.string()`                                            | `default`                                                                                       |
| `markdown`            | `markdown`                                                | `z.string()`                                            |                                                                                                 |
| `number`              | `number`                                                  | `z.number()` with `.min`/`.max`                         | `default`, `valueType` (`int`/`float`), `min`, `max`, `step`                                    |
| `boolean`             | `boolean`                                                 | `z.boolean()`                                           | `default`                                                                                       |
| `datetime`            | `datetime`                                                | `z.string()`                                            | `default`                                                                                       |
| `image`, `file`       | `image`, `file`                                           | `z.string()`                                            |                                                                                                 |
| `select`              | `select` (`multiple: false`)                              | `z.enum(options)`                                       | `options` (const tuple), `default`                                                              |
| `multiSelect`         | `select` (`multiple: true`)                               | `z.array(z.string())`                                   | `refOptions: { collection, field }` ([§6.5](#65-reference-options-resolved-at-generation-time)) |
| `relation`            | `relation`                                                | `z.string()` or `z.array(z.string())`                   | `collection`, `searchFields`, `valueField`, `displayFields`, `multiple`                         |
| `list` (no item spec) | `list`                                                    | `z.array(z.string())`                                   | `min`, `max`                                                                                    |
| `list({ field })`     | `list` with `field: { name: "item" }`                     | `z.array(field)`                                        | `min`, `max`                                                                                    |
| `list({ fields })`    | `list` with `fields`                                      | `z.array(z.object(fields))`                             | `min`, `max`                                                                                    |
| `list({ types })`     | `list` with `types` ([§6.4](#64-tagged-lists-and-unions)) | `z.array(z.union(...))`                                 | `min`, `max`                                                                                    |
| `union({ types })`    | `list` with `types`, `min: 1`, `max: 1`                   | single typed item ([§6.4](#64-tagged-lists-and-unions)) |                                                                                                 |
| `object({ fields })`  | `object`, `collapsed: true`                               | `z.object(fields)`                                      |                                                                                                 |

Lists and objects are emitted `collapsed: true` so long entries open compact in the editor. `min`/`max` on a list are enforced both by Zod and by the Decap widget.

### 6.2 Labels carry the field key

Whenever a field is placed into a map (`defineCollection`, `fields.object`, `fields.list({ fields })`, and each variant of `types`), its Decap label becomes `"<Label> [<key>]"`, for example `Content [content]`. This is what lets the admin locate an editor field from a dot path ([§9.6](#96-click-to-edit-focusing-the-editor-field)): labels are the only stable handle Decap's DOM exposes, and the bracketed key makes them unambiguous when the same human label appears at several nesting levels.

### 6.3 Everything is optional at the collection root

`defineCollection` wraps every top-level field in `.optional()`, and gives list fields `.default([])`. Partially written entries and live-preview payloads with missing fields therefore parse without throwing, and callers handle `undefined` (the shared `nil` type in `src/global.d.ts` is `null | undefined`). Nested fields keep the required-ness their builders declare.

`defineCollection` also fills Decap defaults: `create: true`, `identifier_field: "title"`, `slug: "{{slug}}"`, and an optional `extension`. `previewPath` is mandatory and is either a function from slug to site path or `null` for collections that have no page of their own ([§9.2](#92-preview-component)). The returned `CollectionDefinition` carries `name`, the Zod `schema`, the Decap `collectionConfig`, and `previewPath`.

### 6.4 Tagged lists and unions

`fields.list({ types })` takes a record of `CmsField`s whose keys become the variant names. Each variant's object schema is extended with `type: z.literal(key)`, and the array item is the union of the variants. The Decap side becomes a `list` with `types`, each an `object` widget labelled `"<Label> [<key>]"`, which is how editors add, reorder, and configure polymorphic items such as page modules. `fields.union` is the same construction wrapped as a one-element list (`min: 1, max: 1`) whose Zod schema transforms the array into its single item; it exists for fields that hold exactly one typed variant. At the snapshot no model uses `union`.

### 6.5 Reference options resolved at generation time

`multiSelect` emits a private `ref_options: { collection, field }` on its Decap config. `scripts/generate-cms-config.ts` reads every collection's content first, collects the distinct string values of `field` across that collection's entries (flattening arrays), sorts them, writes them as the widget's `options`, and deletes `ref_options`. The resolution recurses through `fields`, `types`, and `field`. This is how the gallery item `tags` field offers exactly the tags listed in the `tags` collection without a Decap `relation` widget, which cannot target values inside a list field.

### 6.6 Collections

`src/models/index.ts` exports `collectionRegistry`, an ordered array used by the generator, the validator, and the admin. All five collections keep the default `slug` and `extension`.

| Name                | Label             | Folder                             | `create` | Identifier | `previewPath` | Fields                                                                                                                                              |
| ------------------- | ----------------- | ---------------------------------- | -------- | ---------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page`              | Page              | `public/content`                   | yes      | `title`    | `/${slug}`    | `title` string; `modules` list of `ModuleRegistryShape` types, optional                                                                             |
| `flavor-categories` | Flavor Categories | `public/content/flavor-categories` | no       | `name`     | `null`        | `name`; `categories` list of `{ name, flavors: list of { name } }`                                                                                  |
| `tags`              | Tags              | `public/content/tags`              | no       | `name`     | `null`        | `name`; `tags` string list                                                                                                                          |
| `gallery-items`     | Gallery Items     | `public/content/gallery-items`     | no       | `name`     | `null`        | `name`; `items` list of `{ image, title, description text, date datetime, tags multiSelect ← tags.tags }`                                           |
| `constants`         | Constants         | `public/content/constants`         | no       | `name`     | `null`        | `name`, `siteName`, `galleryClose`, `galleryPrevious`, `galleryNext`, `notFoundTitle`, `notFoundHeading`, `inquireLabel`, all strings with defaults |

The `page` folder is the root of `public/content`; because both the generator and Decap read a folder non-recursively, the sub-folders of the other collections do not collide with it. The four non-page collections are singletons: `create: false`, one entry each named `main`.

Module shapes live in `src/models/modules/*.shape.ts` as plain `{ label, fields }` objects, wrapped with `fields.object` only when placed in a registry or when their TypeScript type is derived. `src/models/BaseModuleRegistry.shape.ts` holds the leaf modules (`hero`, `flavorMenu`, `general`, `gallery`) as `baseModuleFieldGroups`; `src/models/ModuleRegistry.shape.ts` spreads them and adds the container `grid`. `GridModule.shape.ts` builds its item variants from `baseModuleFieldGroups` directly rather than from `ModuleRegistryShape`, which avoids a circular import and encodes the rule that containers hold leaves, never other containers. `src/models/components/Link.shape.ts` (`label`, `url`, `variant` select of `primary`/`secondary` defaulting to `primary`) is the one reusable sub-shape; it is used as the single `link` variant of the CTA lists in `hero` and `general`.

### 6.7 Generated artifacts

`scripts/generate-cms-config.ts` (`--dev` for development, `--watch` to stay running) writes three things:

- **`public/admin/config.yml`.** Gitignored and never edited by hand. In dev: `local_backend: true` and `backend: { name: test-repo }`. With `local_backend`, Decap probes `decap-server` on startup and, when it answers, swaps in the `proxy` backend so edits are written to the working tree; the `test-repo` name is only the in-memory fallback when the proxy is absent. In production: `backend: { name: github, repo: $CMS_GITHUB_REPO, branch: $CMS_GITHUB_BRANCH ?? main }`. Both set `media_folder: public/images` and `public_folder: /images`. `collections` is `collectionRegistry` with `ref_options` resolved.
- **`public/content/<folder>/<slug>.json`**, one per entry: the front matter as JSON. The Markdown body is not carried over; all content lives in front matter.
- **`public/cms-manifest.json`**: `{ collections: [{ name, folder, slugs }] }`.

In watch mode the script uses `fs.watch` on each collection folder and regenerates on any `.md` change. Model (TypeScript) changes require restarting it. The admin reloads when the rewritten `config.yml` is detected ([§5](#5-build)), not when model files change.

### 6.8 Validation

`scripts/validate-content.ts` parses every `.md` in every collection folder with `gray-matter` and `safeParse`s the front matter against the collection schema, printing each issue as `path: message` and exiting non-zero if any file fails. Missing folders are skipped. It runs in `prebuild`.

## 7. Runtime content access

### 7.1 Fetching

`src/lib/content.ts` reads the generated JSON over HTTP rather than from disk, so the same code runs on the server and in the browser. `getManifest` fetches `${VITE_SERVER_URL}/cms-manifest.json`; in production it caches the result for the life of the server process or browser session (content is static after generation), and in dev it fetches with `cache: "no-store"` every time. `getCollectionItem(collection, slug)` returns `undefined` when the slug is not in the manifest or the JSON request fails; otherwise it converts every `null` to `undefined` recursively (YAML `~`/empty values arrive as `null`, Zod optionals expect `undefined`), parses with the collection schema, and attaches `_slug`. `getCollection` maps the manifest's slugs through `getCollectionItem` and drops the misses. The JSON URL is the collection folder with the leading `public` stripped.

### 7.2 Primitives

`src/primitives/createContentFetch.ts`:

- `contentQuery(key, fn)` wraps `fn` in the router's `query` for deduplication and preload in production, and returns `fn` unwrapped in dev so edits are visible immediately.
- `createContentFetch(key, fn)` and `createContentFetch(key, fn, args)` combine `contentQuery` with `createAsync`. The zero-argument form is for singleton fetches (`flavor-categories/main`, `gallery-items/main`, `tags/main`); the parameterized form re-runs when `args()` changes.
- `createCmsContent(collection, fn, slug)` is what routes use. It fetches with `collection.name` as the query key, subscribes to live preview ([§7.3](#73-constants)), and reconciles whichever is newer (live preview wins when present) into a Solid store with `reconcile`, so consumers see one stable object reference and `<Show>` does not remount on every keystroke in the editor. When the incoming data is a live update it records `window.scrollY` before the reconcile and restores it on the next tick, because a preview re-render would otherwise jump to the top. Until the effect has run (SSR and the first client tick) it returns the fetched value directly.

`src/primitives/createCmsLiveContent.ts` returns a signal that is `undefined` until a `cms-preview-update` message arrives for the matching slug, then holds the message's `data` parsed (`safeParse`; invalid payloads are ignored) with `_slug` attached. It only listens on the client.

### 7.3 Constants

`src/primitives/ConstantsContext.tsx` wraps the app in `ConstantsProvider`, which runs `createCmsContent` on the `constants` collection's `main` entry, and exposes `useConstants()` as an accessor (throwing outside the provider). Constants are the home for every perceivable string that does not belong to a specific content item: the site name, the gallery modal's close/previous/next labels, the not-found title and heading, and the "Inquire" button label.

## 8. CMS-linked rendering and click-to-edit

### 8.1 Path and source context

`src/lib/cms/CmsPathContext.tsx` holds a context of `{ path, source? }`. `CmsPathContextProvider value="items.3"` appends to the ambient path (`a.b` + `c` → `a.b.c`); `CmsSourceContextProvider collection slug` resets the path to `""` and sets the source, marking a new root. `useCmsFieldProps(property, overrideSource?)` returns an accessor to a spread-ready object: `data-cms-field` is `path.property` (or just `property` when an override source is given, since a new root has no ambient path), plus `data-cms-collection` and `data-cms-slug` when a source is known. These attributes are inert outside the preview.

### 8.2 `Content`

`src/components/Content.tsx` renders one field. It is generic over the content object so `property` must be a key of it. It reads the value with `lodash/get`, renders nothing when the value is falsy, and otherwise:

- `type="string"` without children renders `<span {...cmsProp()}>{value}</span>`;
- `type="markdown"` without children renders `<div class="not-first:mt-5" innerHTML={marked(value)} />` with the CMS props on the div;
- with a render-prop child it calls `children(valueAccessor, cmsProp)` so the caller picks the element and where the click target lands. For markdown the accessor yields the rendered `<div>`.

Markdown is inserted as HTML without sanitization; content is trusted because it is committed to the repository.

### 8.3 `ContentFor`

`src/components/ContentFor.tsx` is `<For>` over an array field of a parent object (`field` is type-constrained to array-valued keys). Each item is wrapped in `CmsPathContextProvider value="<field>.<index>"`, and when a `source` is passed, also in `CmsSourceContextProvider`, so the items of an embedded collection (flavors inside a page module, tags) point click-to-edit at their own entry. The child function receives `(item, index, cmsProp)` where `cmsProp` targets the item itself, which is how a primitive list item (a tag string) gets its click target. An optional `fallback` renders for an empty array.

### 8.4 Preview-side behavior

`src/lib/utils/setupCmsPreview.ts` runs once from `App`'s `onMount` and returns immediately unless the window is framed (`window !== window.top`, treating a `SecurityError` as framed). Inside the preview it:

1. Adds `cms-preview` to `<body>`. `src/app.css` gives `body.cms-preview [data-cms-field]` a `pointer` cursor and a 2 px dashed transparent outline at 8 px offset that turns `outline-primary` on hover, with a 150 ms color transition. Nothing changes outside the preview.
2. Restores the scroll position saved for the current URL (`localStorage["cms-scroll:<path><search><hash>"]`) 500 ms after load, inside a `requestAnimationFrame` so it lands after the router's own scroll reset; and saves `scrollY` on every non-zero scroll. Live-preview reloads therefore keep the editor's place on long pages.
3. Patches `history.pushState` and `history.replaceState` and listens to `popstate`, sending `cms-route-change { path, source }` to the admin after every navigation so the preview's address bar follows in-app routing.
4. Installs one delegated `click` listener on `document` that calls `preventDefault()` on every click, and when the click lands inside a `[data-cms-field]` element, stops propagation and sends `cms-field-focus { fieldPath, collection?, slug? }` read from the element's attributes.

Messages are posted to `window.top` (falling back to `window.parent` on a cross-origin error) because Decap nests the preview two frames deep, so `window.parent` is Decap's own preview frame rather than the admin window ([§9.6](#96-click-to-edit-focusing-the-editor-field)).

### 8.5 Message protocol

`src/lib/cms/messages.ts` is shared by both bundles.

| Type                 | Payload                                          | Direction       |
| -------------------- | ------------------------------------------------ | --------------- |
| `cms-field-focus`    | `{ fieldPath, collection?, slug? }`              | preview → admin |
| `cms-route-change`   | `{ path, source: "push" \| "replace" \| "pop" }` | preview → admin |
| `cms-preview-update` | `{ slug, data }`                                 | admin → preview |

`dispatch(target, type, payload)` posts `{ type, payload }` with `window.location.origin` as the target origin, so the protocol only works when admin and site share an origin, which the dev proxy and the production `/admin/` path both guarantee. `createMessageHandler(handlers)` returns a `message` listener that ignores events without a `type` and routes the rest.

## 9. Admin

### 9.1 Entry and preview registration

`admin/index.html` loads `admin/admin.tsx`, which imports the browser patches ([§9.7](#97-browser-patches)), `admin.css` ([§9.8](#98-admin-styles)), and `navigateToField.ts` ([§9.6](#96-click-to-edit-focusing-the-editor-field)) for their side effects, calls `CMS.init()`, and registers an iframe preview template for every collection in `collectionRegistry` via `buildIframePreviewComponent({ previewPath })`. A factory is used because Decap passes preview templates only `entry` and its own props, leaving no way to inject the collection's `previewPath` otherwise.

### 9.2 Preview component

`admin/IframePreview.tsx` renders a full-height (`100dvh`) two-row grid: `BrowserNavBar` above `PreviewFrame`. State:

- `viewScale` (`native` default) and the current URL are persisted in `localStorage` ([§9.5](#95-local-storage-keys)) so they survive Decap's own navigation.
- The URL initializes to `previewPath(slug)` for collections that have one, except when a cross-collection transition is in progress ([§9.6](#96-click-to-edit-focusing-the-editor-field)), in which case the stored URL is kept so the preview does not jump away mid-transition. Collections with `previewPath: null` (constants, tags, flavor categories, gallery items) initialize from the stored URL, so editing them previews whichever page was open last.
- When the slug changes after mount (switching entries within a collection), the history is reset and the preview navigates to that entry's default path.
- Incoming `cms-route-change` messages update the address bar and push or replace in the history stack; `pop` only updates the display because the iframe's own history already moved.

`BrowserNavBar` (`admin/components/BrowserNavBar.tsx`) is styled to match Decap: 14 px gap and padding, `2px solid #dfdfe3` bottom border, monospace font, square buttons tinted `#3a69c7` at 12.5 % alpha with 5 px radius, and a URL input with `16px 20px` padding, 15 px text, and a dashed highlight outline. Controls, left to right: back, forward (disabled at 35 % opacity when unavailable), home (the entry's default path, or `/` when none), reload, the editable URL (navigates on Enter only), and a scale toggle cycling native → desktop → mobile → native.

`PreviewFrame` (`admin/components/PreviewFrame.tsx`) draws 20 px canvas rulers along the top and left (`admin/components/Rulers.tsx`: `#f8f8f9` background, `#dfdfe3` border, `#c0c0c4` ticks, `#aaa` 9 px monospace labels, HiDPI-aware; major interval chosen as a "nice" 1/2/5 multiple near 80 px, minor at a fifth of that). Scales:

| Scale     | Iframe width | Rendering                                                                            |
| --------- | ------------ | ------------------------------------------------------------------------------------ |
| `native`  | container    | fills the pane; rulers show CSS pixels                                               |
| `desktop` | 1920 px      | `transform: scale(container / 1920)` from the top-left; rulers show simulated pixels |
| `mobile`  | 375 px       | same, scaled to fit the container width                                              |

The frame exposes `back`, `forward`, `reload`, and `navigateTo` through a ref, reports the iframe's path on each `load`, and sends `cms-preview-update { slug, data }` both whenever `entry` changes (`entry.get("data").toJS()`) and on every iframe `load`, so a freshly navigated page receives the current draft.

### 9.3 Navigation history

`admin/hooks/useNavigationHistory.ts` keeps a client-side stack with an index. `push` ignores duplicates of the current entry and truncates any forward entries; `replace` swaps the current entry; `reset` replaces the stack with one entry; `back`/`forward` move the index and call the supplied navigate function. A `skipNextPush` flag is set by `reset`, `back`, and `forward` so the iframe's subsequent `load` event does not record a second entry.

### 9.4 Live preview flow

Editing a field makes Decap re-render the preview component with a new `entry`; `PreviewFrame` posts the raw data to the iframe; the site's `createCmsLiveContent` validates it and `createCmsContent` reconciles it into the page, preserving scroll. Unsaved edits are visible without a file write.

### 9.5 Local storage keys

`admin/localStorageKeys.ts`:

| Key                         | Holds                                                  |
| --------------------------- | ------------------------------------------------------ |
| `cms-view-scale`            | `ViewScale`                                            |
| `cms-preview`               | current preview URL                                    |
| `cms-field`                 | field path pending after a cross-collection transition |
| `field-document-transition` | `true` while such a transition is in flight            |

`admin/hooks/useLocalStorageState.ts` is `useState` persisted as JSON, with an `initializeToDefault` predicate that overwrites the stored value with the default on mount when it returns `true`.

### 9.6 Click-to-edit: focusing the editor field

Decap renders preview templates inside a `react-frame-component` frame, so the structure is admin window → Decap preview iframe → site iframe. The site posts to `window.top` to reach the admin document, where the editor fields live; the listener is installed in `navigateToField.ts` at admin-window level for the same reason.

`navigateToField(fieldPath)` walks the dot path against the admin DOM, since Decap offers no API for focusing a field:

- A **numeric** segment selects the nth list item. The list container is found by starting at the first `<label>` in the current search space and ascending until a parent has several children whose first label text matches, falling back to the label's grandparent for single-item lists. Collapsed items are expanded by clicking their toggle (collapse is detected from the `display` of the nested-object label that Decap shows only while collapsed), then waiting 300 ms for the animation.
- A **named** segment finds the label whose text contains `[key]`. On the final segment it scrolls the label into view (smooth, centered) and, after 500 ms, focuses the first match of: the element the label is `for`; an input, textarea, or contenteditable inside the label; inside the label's next sibling; inside the label's parent's next sibling (covers string/text widgets and the markdown widget's separate editor). On an intermediate segment the label's `for` target becomes the new search space.

**Cross-collection transitions.** When the message carries `collection` and `slug` and Decap's hash is not already `#/collections/<collection>/entries/<slug>`, the handler stores the field path and sets the transition flag, changes the hash, and reloads. On the next load a startup block sees the flag, waits 1 s for Decap to render the entry, runs `navigateToField` with the stored path, and clears the flag. This is how clicking a flavor name while editing a page lands in the flavor categories entry with the right field focused.

### 9.7 Browser patches

`admin/browser-patches.ts` runs before `CMS.init()`. `window.confirm` answers `true` to Decap's "A local backup was recovered for this entry, would you like to use it?" so the prompt stops appearing on every load without discarding the backup; other confirms pass through. In dev only, `window.addEventListener` drops `beforeunload` registrations so Chrome's unsaved-changes dialog does not interrupt reloads.

### 9.8 Admin styles

`admin/admin.css` sets `--highlight-color: #3a69c7`, gives focused inputs and contenteditables a 2 px dashed outline at −4 px offset (matching the preview's hover affordance), hides Decap's "Toggle preview" and "Sync scrolling" buttons (the preview is always on and scroll sync is replaced by [§8.4](#84-preview-side-behavior)), and widens the editor/preview resizer's hit area to 22 px with a transparent background.

## 10. Site shell and routes

`src/entry-server.tsx` renders `<html lang="en">` with `charset`, a `width=device-width, initial-scale=1` viewport, `/favicon.ico`, and `<body class="@container">` ([§11.2](#112-responsive-model)); the handler uses `mode: "async"`. `src/entry-client.tsx` mounts `StartClient` into `#app`.

`src/app.tsx` is the router root: `MetaProvider` → `ConstantsProvider` → a `<Title>` of `SolidStart - Basic`, two literal links (`Index`, `About`), `<Suspense>` around the matched route, and `<ModalRenderer />` ([§15.1](#151-routing)). `setupCmsPreview` runs in `onMount`.

| Route    | File                      | Behavior                                                                                                                                                                                                                                                                                                                                    |
| -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`      | `src/routes/index.tsx`    | SolidStart template page ("Hello world!")                                                                                                                                                                                                                                                                                                   |
| `/about` | `src/routes/about.tsx`    | Placeholder heading "About"                                                                                                                                                                                                                                                                                                                 |
| `/:slug` | `src/routes/[slug].tsx`   | CMS page. `route.preload` warms `contentQuery("page")`. Renders `<Title>{title}</Title>`, then every module through `ContentFor each={page} field="modules"` → `ModuleRegistry`, inside `CmsSourceContextProvider collection="page" slug`. When no entry matches it renders the not-found heading from constants with `HttpStatusCode 404`. |
| `/*`     | `src/routes/[...404].tsx` | Not-found page: constants' title and heading, status 404, and template text linking to start.solidjs.com                                                                                                                                                                                                                                    |

## 11. Design system

### 11.1 Tokens

Defined in `@theme` in `src/app.css`:

| Token                                  | Value                                                  | Use                                              |
| -------------------------------------- | ------------------------------------------------------ | ------------------------------------------------ |
| `--color-primary`                      | `#65ffce`                                              | Accent: buttons, borders, selected states        |
| `--color-primary-foreground`           | `#181614`                                              | Headings; text on primary                        |
| `--color-secondary-foreground`         | `#444444`                                              | Body text, h3, eyebrow                           |
| `--color-dark-primary-foreground`      | `#ffffff`                                              | Headings in `.dark`                              |
| `--color-dark-secondary-foreground`    | `#cccccc`                                              | Body text in `.dark`                             |
| `--color-border`                       | `#e8e2da`                                              | Chip and filter borders                          |
| `--color-eggshell`                     | `#f3f1ee`                                              | Chip background                                  |
| `--font-serif`                         | "Old Standard TT", serif                               | Headings                                         |
| `--font-sans`                          | "Montserrat", sans-serif                               | Body                                             |
| `--container-dsk`                      | `1024px`                                               | Desktop breakpoint (container query)             |
| `--container-widest`                   | `1920px`                                               | Page max width ("max" would clash with Tailwind) |
| `--spacing-max-content`                | `var(--container-dsk)`                                 | Content column max width                         |
| `--spacing-max-page`                   | `var(--container-widest)`                              | Page max width                                   |
| `--spacing-min-dsk-padding`            | `40px`                                                 | Desktop side gutter                              |
| `--spacing-min-mbl-padding`            | `16px`                                                 | Mobile side gutter                               |
| `--shadow-base`                        | `0 4px 20px` at 10 % black (tintable via shadow color) | Card and hover shadow                            |
| `--default-transition-duration`        | `350ms`                                                | All Tailwind transitions                         |
| `--default-transition-timing-function` | `cubic-bezier(0.32, 0.72, 0, 1)`                       | All Tailwind transitions                         |

Fonts are self-hosted from `public/fonts/` and declared in `src/assets/fonts/fonts.css`: Old Standard TT regular, italic, and bold as static files; Montserrat and Montserrat Italic as variable fonts covering weights 100–900.

### 11.2 Responsive model

`@dsk` is a container-query variant derived from `--container-dsk`, and `<body>` is the `@container`, so `@dsk:` and `@max-dsk:` resolve against the viewport. `src/lib/utils/createBreakpoint.ts` mirrors the same 1024 px threshold in JavaScript (`DSK_BREAKPOINT_PX`) through `matchMedia`, defaulting to mobile on the server and until `onMount` so the first client render matches SSR. `createBreakpoint.IsMobileView()` is the boolean convenience used by the gallery and modal. Although the default behavior is itended to be mobile-first, the design sources are always desktop-first with a simple flex-wrapping behavior on mobile.

### 11.3 Dark variant

`@custom-variant dark (&:where(.dark, .dark *))` makes `dark:` a class-driven variant rather than a media query. The only producer of `.dark` is `HeroModule` when it has a background image, so its text switches to the dark-foreground tokens over the photo. There is no site-wide dark theme.

### 11.4 Utilities and base styles

| Utility             | Expands to                                                                        |
| ------------------- | --------------------------------------------------------------------------------- |
| `page-container`    | `max-w-max-page mx-auto`                                                          |
| `content-container` | `max-w-max-content mx-auto px-min-mbl-padding @dsk:px-min-dsk-padding`            |
| `block-padding`     | `not-first:mt-5`                                                                  |
| `highlight-border`  | `text-secondary-foreground dark:text-primary border-y-2 border-primary py-1`      |
| `button-hover`      | `transition-all duration-250 hover:shadow-base active:shadow-none shadow-primary` |

Element defaults: `h1`–`h3` are `font-serif text-primary-foreground dark:text-dark-primary-foreground`; `h1`–`h3` and `p` get `block-padding text-balance`. Type scale: `h1` `text-5xl @dsk:text-6xl`; `h2` `text-4xl @dsk:text-5xl italic`; `h3` `text-xl @dsk:text-2xl text-secondary-foreground`; `p` `font-sans text-sm @dsk:text-base text-secondary-foreground dark:text-dark-secondary-foreground`. Links and buttons have a 4 px transparent outline at 4 px offset that becomes `outline-primary` on `:focus-visible`. Tap highlight is disabled everywhere and `scrollbar-gutter: stable` is set on `html` so modal scroll-locking does not shift layout.

## 12. Shared components

- **`Eyebrow`** (`src/components/Eyebrow.tsx`): a `<p>` wrapping a `uppercase tracking-widest text-xs @dsk:text-sm highlight-border` span. Props spread onto the `<p>`.
- **`LinkButton`** (`src/components/LinkButton.tsx`): a router `<A>` with variants. Text variants share `uppercase inline-flex tracking-wide text-sm px-6 py-4 border rounded-full justify-center gap-2 text-center hover:brightness-90 button-hover` and stretch (`flex-[1_1_auto]`) on mobile. `primary` is `bg-primary text-primary-foreground border-primary`; `secondary` is current-color bordered text that fills with primary on hover. `icon` (also exported as `iconLinkButtonClass` for plain buttons) is a 44 px (`h-11 w-11`) primary circle.
- **`ListItemChip`** (`src/components/ListItemChip.tsx`): an `<li>` pill, `rounded-full border border-border bg-eggshell px-2 py-1 text-sm`.
- **`ControlledActionSheet`** (`src/components/ControlledActionSheet.tsx`): the bottom sheet used by the mobile gallery modal. Collapsed height 100 px (`COLLAPSED_HEIGHT_PX`), a 32 px drag handle with a `h-1 w-10 bg-black/20` pill, expanded height `min(content + handle, 92vh)` measured by a `ResizeObserver`. Dragging on the y axis (after the 8 px axis lock, [§16](#16-shared-utilities)) moves the sheet live without transition; on release it snaps to whichever state is nearer and reports the change. While expanded, drags that the inner scroller can absorb scroll instead of moving the sheet; the scroller only becomes `overflow-y-auto` 350 ms after the sheet comes to rest expanded, so the open animation is not interrupted by scroll. A 96 px white fade covers the bottom while collapsed and disappears once a drag has moved up more than 20 px. Double-clicking the handle toggles. Touch and mouse paths are both wired because browsers do not synthesize mouse-move streams for finger drags.

## 13. Modules

### 13.1 Registry

`src/modules/ModuleRegistry.tsx` maps module keys to components (`hero`, `grid`, `flavorMenu`, `general`, `gallery`) and renders the matching one with `<Dynamic>`. Every module receives `shape`, the parsed module object, and is rendered inside the `ContentFor` path context `modules.<index>` so its fields resolve to `modules.<index>.<field>`.

### 13.2 Modules

**Hero** (`src/modules/HeroModule.tsx`; fields `eyebrow`, `content` markdown, `ctaList` of links (optional), `backgroundImage` (optional)). `<section class="m-4 @dsk:m-10">` containing a `page-container relative` that gains `dark` when a background image is set. The image is `absolute inset-0 object-cover` under a gradient (`from-black/75 via-black/50 to-transparent`, bottom-to-top on mobile, left-to-right on desktop). Content sits in a `content-container` with `pt-30 pb-5 @dsk:py-30` over an image or `py-8 @dsk:py-12` without, limited to `max-w-xl @dsk:max-w-1/2`: eyebrow, markdown, then CTAs in `flex gap-2`. A CTA renders only when both `url` and `label` exist.

**General** (`src/modules/GeneralModule.tsx`; one field `submodules`, each `title`, optional `heroImage`, optional `body` markdown, optional `ctaList`). `<section class="not-first:pt-10">`; each submodule is `not-first:pt-10 @dsk:not-first:pt-12` and opens with a 2 px primary `<hr>` (`mb-10 @dsk:mb-12`) hidden for the first submodule on desktop. Then an `h2` title, an optional image strip (`max-h-32 bg-primary flex justify-center`, image `object-contain`), the body, and stacked CTAs.

**Flavor menu** (`src/modules/FlavorMenuModule.tsx`; fields `heading`, optional `footnote`). Fetches `flavor-categories/main` with `createContentFetch` and renders an `h2`, then a list of categories (`pt-5`, `h3` with `border-b-2 border-primary`) each holding a `flex flex-wrap gap-2 mt-5` row of `ListItemChip`s, then the footnote in a `<p>`. The category list is a `ContentFor` with `source={{ collection: "flavor-categories", slug: "main" }}` so clicks edit the flavor entry ([§9.6](#96-click-to-edit-focusing-the-editor-field)).

**Grid** (`src/modules/GridModule.tsx`; one field `items`, exactly two (`min: 2, max: 2`) leaf-module variants each extended with an optional integer `antecedent`). `<section class="page-container mt-10 @dsk:mt-12">` with a `content-container` that stacks (`flex flex-col`) on mobile and becomes `@dsk:grid` with `grid-template-columns` built from the items' antecedents as `<n>fr <m>fr`. On desktop each cell has `py-12`, the second has a 2 px primary left border and `pl-10`, the first has `pr-10`. Items render through `ModuleRegistry` again.

**Gallery** (`src/modules/GalleryModule/`; one field `heading`). See [§14](#14-gallery-module).

### 13.3 Adding a module

A module is four pieces, added in this order so that each one type-checks against the one before it:

1. **Shape.** `src/models/modules/<Name>Module.shape.ts` exports `<Name>ModuleShape` and its derived `<Name>ModuleType`. A leaf's shape is the plain `{ label, fields }` object of [§6.6](#66-collections); a container wraps its own with `fields.object`, as `GridModule.shape.ts` does.
2. **Shape registration.** Whether the module can hold other modules decides the registry. A leaf, which cannot, is added to `baseModuleFieldGroups` in `BaseModuleRegistry.shape.ts`, which also makes it available as a grid item. A container, which can, is added to `ModuleRegistryShape` and `ModuleRegistryType` in `ModuleRegistry.shape.ts` beside `grid`, and builds its item variants from `baseModuleFieldGroups`.
3. **Component.** `src/modules/<Name>Module.tsx`, or a `src/modules/<Name>Module/` directory when it has helpers of its own, taking the `shape` prop of [§13.1](#131-registry).
4. **Component registration.** The component is added to `moduleRegistry` in `ModuleRegistry.tsx` under the same key as the shape. `moduleRegistry` is checked with `satisfies` against the keys of `ModuleRegistryType`, so a shape registered without a component fails the type check.

## 14. Gallery module

### 14.1 Data and ordering

`GalleryModule.tsx` fetches `gallery-items/main` and `tags/main`. Items are sorted by `date` descending (`compareDatesDescending`; undated items sort last) while keeping each item's `originalIndex` into the unsorted array, because click-to-edit paths (`items.<originalIndex>`) and the modal's lookups refer to the file order, not the display order.

### 14.2 Layout

`<section class="mt-12 @max-dsk:mt-10 page-container">` → `content-container` → `h2` heading → filter row → the grid. The grid is a `<ul>` with `grid gap-4 items-start` and `repeat(var(--desktop-cols))` / `repeat(var(--mobile-cols))` columns, bridging `DESKTOP_COLS = 4` and `MOBILE_COLS = 2` from JavaScript. It always renders four `<li>` columns (a stable constant array, so Solid never recreates column nodes); columns 2 and 3 are `@max-dsk:hidden`. Items are distributed round-robin across the columns active at the current breakpoint, capped at `MAX_PER_COLUMN = 3` per column, so at most 12 items are visible. A breakpoint change rebuilds the buckets immediately and clears any animation state.

Each item is a `rounded-2xl overflow-hidden` wrapper around a router link (`button-hover rounded-2xl`) holding the image (`object-cover`, `alt` = title). Its `aspect-ratio` is `1 / h` where `h` is seeded from the image URL into `[0.5, 1]` (`seededRandom`, [§16](#16-shared-utilities)), giving a stable masonry rhythm with no layout shift between renders. The link opens the modal ([§15](#15-gallery-modal)) with `noScroll`. Each item is wrapped in `CmsSourceContextProvider collection="gallery-items" slug="main"` and `CmsPathContextProvider value="items.<originalIndex>"`.

### 14.3 Filtering

Filter chips render only when the tags collection has tags: an "All" chip plus one per tag, as router links (`noScroll`) that set or clear the `galleryFilterTag` query parameter ([§16](#16-shared-utilities)). Chip styling: `rounded-full px-4 py-1 text-sm border border-border text-secondary-foreground hover:border-primary button-hover`, with `aria-selected` driving `bg-primary text-primary-foreground border-primary`. Tag chips are a `ContentFor` with `source` on the tags collection, so clicking a chip in the preview edits the tags entry. Filtering keeps items whose `tags` include the selected tag.

### 14.4 Filter animation

`createGalleryFilterAnimation.ts` animates a filter change in two phases, driven by `displayBuckets`, `leavingIndices`, and `enteringIndices` signals:

1. **Leave.** The list's `min-height` is frozen at its current `offsetHeight` (no transition). Items that will disappear are marked leaving, which switches their wrapper from `grid-rows-[1fr] mb-4` to `grid-rows-[0fr] mb-0`; the wrapper's `overflow-hidden` is what lets the aspect-ratio child collapse. The commit is scheduled after `GALLERY_DURATION_MS + 10` ms (or immediately when nothing leaves).
2. **Commit.** Inside `document.startViewTransition` with type `gallery-filter`: entering items are marked entering, the new buckets are applied, and leaving is cleared, in that order (clearing leaving first would briefly re-expand items about to be removed). Surviving items carry `view-transition-name: gallery-item-<originalIndex>` so the View Transitions API slides them to their new slots; entering items use `none` so their own CSS height expansion is not snapshotted. Two `requestAnimationFrame`s later, entering is cleared so the expansion runs, and `GALLERY_DURATION_MS + 50` ms after that the container is released: `min-height` transitions to `0` and is then removed. Releasing any earlier produces a dip, because entering items are still at zero height when the container would start shrinking.

`GalleryModule.css` configures the transition at `:root:active-view-transition-type(gallery-filter)`: old snapshots are hidden and new ones shown without animation, and group animations use the design-system duration and easing. The rules target root pseudo-elements and must stay global. Transitions are no-ops in browsers without `startViewTransition` (`withViewTransition` calls the update directly).

## 15. Gallery modal

### 15.1 Routing

Modal state lives in the URL. `src/lib/utils/QueryParamSchemas.ts` defines two parameters through `defineQueryParams` ([§16](#16-shared-utilities)): `modal`, a discriminated union currently with one variant `{ type: "gallery", payload: { imageUrl } }`, and `galleryFilterTag`, a string. `src/components/modals/ModalRenderer.tsx` is mounted once in `App`, renders into a `<Portal>`, and switches on `modal()?.type`. Because the modal is a query parameter, opening it is a history entry, Back closes it, and a modal URL is shareable and renders on the server.

### 15.2 Open and close transition

`createGalleryModalTransition.ts` gives the opened image the `view-transition-name: gallery-modal-image` on both ends. On mount it finds the gallery `<img>` with the same `src` outside `[data-modal]`, names it, and runs a view transition in which the name moves to the modal's image (`transitioned` flips to true). On close it runs a view transition that clears the `modal` parameter and names the source image again. A module-level `isModalTransitioning` signal is true during either transition; gallery items read it and set their own `view-transition-name` to `none` meanwhile so the grid does not float as separate snapshots. Without the API, or when no source image is on the page, the modal appears immediately.

### 15.3 Shell and navigation

`GalleryModal.tsx` is wrapped in `CmsSourceContextProvider collection="gallery-items" slug="main"` and the path `items.<index>` of the current item. The backdrop is `fixed inset-0 z-50 bg-black/75`; clicking it (but not its children) closes. While open, `document.documentElement.style.overflow` is `hidden`. Three icon controls use `iconLinkButtonClass`: close at `top-4 right-4`, previous at `left-4`, next at `right-4`, the latter two vertically centered and shown only when a neighbor exists; on mobile they are `bg-primary/50 backdrop-blur-xs`. Their accessible names come from the constants `galleryClose`, `galleryPrevious`, and `galleryNext`, and each carries click-to-edit props pointing at that constant.

Previous and next are computed within the **filtered, date-sorted** sequence, so the modal respects the active filter. Keyboard: Escape closes, ArrowLeft/ArrowRight navigate. Navigation changes the `modal` parameter with `scroll: false`; a `navDirectionPending` flag recorded before navigating tells the `imageUrl` effect which way to animate.

### 15.4 Desktop card

`GalleryModalDesktop.tsx`. The card is a 3:2 (`GALLERY_MODAL_ASPECT_RATIO`) `rounded-2xl` box centered with `translate(-50%, -50%)`, height `min(80vh, 80vw / ratio, 1280px / ratio)` so its width never exceeds `GALLERY_MODAL_MAX_SIZE_PX`. It splits into an image panel and a content panel at `flex: 2 1 0%` versus `flex: 1`, the 2 reusing the aspect ratio's height part so the two proportions stay related. The card is transparent and shadowless until `cardReady` (transitioned and no transition in flight), then gains `bg-white shadow-base`, and the content panel slides in from `-translate-x-full`. Previous/next on desktop is a horizontal swap: the outgoing card (same geometry at 85vh) is drawn at `translate(0)` and animated off-screen while the new card enters from the opposite edge, both over the standard duration, with the outgoing DOM removed after `GALLERY_DURATION_MS + 50` ms.

### 15.5 Mobile filmstrip

`GalleryModalMobile.tsx` renders two full-screen `FilmstripLayer`s translated together: one of images and one of `ControlledActionSheet`s, each holding a `GalleryModalContent`. Slots are `{ url, left }` positioned absolutely at multiples of the filmstrip width; the current, previous, and next slots are kept (`prefetchNeighbors` adds neighbors at `±width`, `pruneSlots` drops anything farther than one width). Images are `object-cover` with height `calc(100vh - 100px + 1rem)` so the collapsed sheet overlaps them by 1 rem; only the current image carries the view-transition name and its `alt`.

Swipe (touch and mouse, after the 8 px x-axis lock): the strip follows the finger when a neighbor exists in that direction, or at a third of the distance as a rubber band when it does not. On release it advances when `|dx| > 50px` (`GALLERY_SWIPE_THRESHOLD_PX`) or the velocity exceeds 0.3 px/ms (`GALLERY_SWIPE_VELOCITY`) toward an existing neighbor; otherwise it springs back. Advancing animates the translate by one width, updates the local image URL immediately, and after `GALLERY_DURATION_MS + 50` ms prunes, prefetches, and pushes the new URL to the router. Arrow buttons on mobile reuse the same filmstrip path. Each slot's sheet has its own expanded state; tapping the image (without a drag) collapses that slot's sheet.

### 15.6 Content panel

`GalleryModalContent.tsx` (`p-5`, column, space-between): an `Eyebrow` with the date formatted `en-US` long form in UTC (so a date-only string does not shift by timezone), the title as a centered `h2`, a 2 px primary rule, the description as `text-sm leading-relaxed text-center`; then, pinned to the bottom, a rule, the tags as centered `ListItemChip`s (each click-to-edit via `ContentFor`), another rule, and a full-width `LinkButton` to `/contact` with a mail icon and the `inquireLabel` constant.

## 16. Shared utilities

| File (`src/lib/utils/`)      | Behavior                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `createQueryParamRouting.ts` | `defineQueryParams({ key: { key, schema } })` returns, per parameter, `.href()` → `{ <key>, get<Key>Href }` and `.navigate()` → `{ <key>, navigate<Key> }`. Values are JSON-encoded in the parameter and parsed with the Zod schema (invalid or absent → `null`). Built hrefs keep the current pathname and every other parameter, and `null`/`undefined` removes the parameter. |
| `QueryParamSchema.d.ts`      | The `{ key, schema }` type the above consumes.                                                                                                                                                                                                                                                                                                                                   |
| `createBreakpoint.ts`        | [§11.2](#112-responsive-model).                                                                                                                                                                                                                                                                                                                                                  |
| `createDragAxisLock.ts`      | Decides after 8 px (`AXIS_LOCK_THRESHOLD_PX`) of movement whether a drag is horizontal or vertical; exposes `locked` (matches the requested axis) and `hasMoved`.                                                                                                                                                                                                                |
| `createWindowMouseDrag.ts`   | Returns a `mousedown` handler that attaches `mousemove`/`mouseup` to `window` under an `AbortController`, so drags survive leaving the element; listeners are aborted on mouseup, on the next mousedown, and on owner cleanup. Primary button only.                                                                                                                              |
| `galleryAnimations.ts`       | `GALLERY_DURATION_MS = 350` (mirrors `--default-transition-duration`), `galleryTransition(property, active)` for inline transitions that reference the CSS variables, swipe thresholds, modal size and ratio constants.                                                                                                                                                          |
| `seededRandom.ts`            | FNV-1a style string hash with a final avalanche, returning `[0, 1)`.                                                                                                                                                                                                                                                                                                             |
| `compareDatesDescending.ts`  | Newest first; missing dates compare as −∞ and sort last.                                                                                                                                                                                                                                                                                                                         |
| `setupCmsPreview.ts`         | [§8.4](#84-preview-side-behavior).                                                                                                                                                                                                                                                                                                                                               |

## Known gaps

- **Template remnants.** `/` and `/about` are the SolidStart starter pages, the app shell's `<Title>` is "SolidStart - Basic", the shell renders literal "Index"/"About" links, and the not-found page keeps the starter's "Visit start.solidjs.com" paragraph. These are hardcoded perceivable strings with no CMS source, and there is no real header, navigation, or footer. `package.json` is still named `example-basic`, and `.gitignore` lists outputs for hosts the project does not use (`.wrangler`, `.vercel`, `.netlify`, `.vinxi`).
- **Hardcoded Inquire target.** The modal's Inquire button links to a literal `/contact` rather than a CMS-provided URL.
- **Duplicated 404 markup.** `src/routes/[slug].tsx` re-implements the not-found view instead of sharing it with `src/routes/[...404].tsx`.
- **Dead code.** `src/components/modals/TagsField.tsx` is never imported; `handleShare` in `GalleryModal.tsx` is defined but never wired to a control. `LinkButton` uses two classes with no backing token (`text-pr`, `bg-secondary`), so they do nothing. `ListItemChip` spreads `props` after its composed `class`, so a caller's `class` replaces the base styles instead of extending them.
- **Gallery shows at most 12 items**, with no way to load more or see the full set.
- **Desktop modal geometry mismatch.** The outgoing card is sized at 85vh while the live card is 80vh, so the two differ slightly during a swap.
- **Production CMS config can be silently wrong.** `generate:cms` reads `CMS_GITHUB_REPO` from `process.env` only, and `js-yaml` drops undefined values, so an unset variable produces a `github` backend with no `repo` and no error. The committed `.env.local` value `cakeelizabethdotcom` also lacks the `owner/` prefix Decap requires. No deployment target or preset has been chosen.
- **Admin bundle is built twice** in `npm run build`: once in `prebuild` and again at the end of `build`.
- **Duplicated constants.** `DSK_BREAKPOINT_PX` mirrors `--container-dsk` and `GALLERY_DURATION_MS` mirrors `--default-transition-duration` by hand; a change to one side does not reach the other. `GalleryModal.tsx` also uses the literal `"gallery-items"` where other modules use the collection's `name`.
- **Loose module typing.** `ModuleRegistry` passes `shape: any` (marked `TODO`), so a module component's prop type is not checked against its registry key.
- **Docs drift.** `admin/README.md`'s "Iframe sizing" paragraph describes a `ResizeObserver` mirroring the container height that no longer exists (the preview is a `100dvh` grid), and it says model files are excluded from the admin Vite watcher when `vite.config.admin.ts` has no such exclusion.
- **Heuristic field focus.** `navigateToField` depends on Decap's DOM structure and fixed delays (300 ms expand, 500 ms focus, 1 s after a cross-collection reload); Decap upgrades can break it silently.
- **Dev edits need `decap-server`.** If the proxy is not running, Decap falls back to the in-memory `test-repo` backend and saves appear to succeed without touching disk.
- **No automated tests or lint configuration** exist; Prettier runs with defaults but is not enforced.
