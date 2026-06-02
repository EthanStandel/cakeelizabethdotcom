# cakeelizabeth.com

This document covers the application architecture. For information on the local development architecture and flow, see [`README.local.md`](./README.local.md).

SolidStart site with an aggressively customized Decap CMS admin interface. Content is stored as Markdown files in `public/content/` and committed to the repo.

## Architecture

```
src/          SolidStart app (routes, components, lib, models, modules)
admin/        Decap CMS bundle (separate Vite config, proxied through main server)
public/
  content/    Markdown content files (source of truth for all CMS content)
  admin/      Admin build output (gitignored generated assets)
scripts/      Build-time scripts (CMS config generation, content validation)
```

## Key concepts

### Content model as single source of truth

Collections are defined once in `src/models/` using `defineCollection`. The same TypeScript definitions drive:

`fields.list` now accepts `min` and `max` constraints that are enforced by both Zod and the generated Decap config:

```ts
fields.list({ label: "Items", types: gridItemTypes, min: 2, max: 2 })
```

`fields.union` defines a tagged-union field (a single polymorphic value rather than an array). It works like `fields.list({ types })` but wraps one item instead of an array, and does not generate a Decap list widget — use it for fields that hold exactly one typed variant.

- `public/admin/config.yml` — generated Decap CMS config (gitignored, never hand-edited)
- Content validation — `validate:content` parses every `.md` file against the Zod schema at build time
- Typed content access — `getCollection` / `getCollectionItem` in `src/lib/content.ts` return fully-typed results

### Content fetching

The app fetches content from `/cms-manifest.json` at runtime — a static JSON file built from `public/content/`. Routes use `getCollection` / `getCollectionItem` for SSR and static rendering, and compose with `createCmsLiveContent` for live CMS preview.

`createContentFetch` (`src/primitives/createContentFetch.ts`) wraps `createAsync` + `query` into a single call. In production it caches the server function via SolidStart's `query`; in dev it bypasses the cache so changes are visible immediately.

```ts
// Zero-arg overload — singleton fetch (no preload key needed)
const data = createContentFetch("flavor-categories", () =>
  getCollectionItem(FlavorCategoriesShape, "main")
);

// Parameterized overload — reactive args
const page = createContentFetch(
  "pages",
  (slug: string) => getCollectionItem(pagesCollection, slug),
  () => [params.slug] as const
);
```

`createCmsContent` combines a parameterized fetch with `createCmsLiveContent` and returns one signal. Live CMS preview data takes priority over the fetched result when present:

```ts
const content = createCmsContent(pagesCollection, getCollectionItem, () => params.slug);
// equivalent to: () => liveContent() ?? fetched()
```

### CMS-linked rendering

The `Content` component (`src/components/Content.tsx`) renders content fields with built-in CMS click-to-edit support. It is generic over the content type so `property` is type-checked as a valid key:

```tsx
// Renders a <div data-cms-field="content"> with innerHTML-rendered markdown
<Content content={page} property="content" type="markdown" />

// Render prop — caller controls the outer element; Content provides reactive accessors
<Content content={page} property="title" type="string">
  {(value, cmsProp) => <h1 {...cmsProp()}>{value()}</h1>}
</Content>
```

Renders nothing when the field value is falsy.

Props:

| Prop       | Type                                                                             | Description                                                                                                                                                                                                                      |
| ---------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content`  | `T \| undefined`                                                                 | The full content object (generic)                                                                                                                                                                                                |
| `property` | `keyof T & string`                                                               | Field name — type-checked against `T`                                                                                                                                                                                            |
| `type`     | `"string" \| "markdown"`                                                         | `"string"` renders `<span>`, `"markdown"` renders `<div innerHTML>` via `marked`                                                                                                                                                 |
| `children` | `(element: () => …, cmsProp: () => { "data-cms-field": string }) => JSX.Element` | Optional render prop. Receives the inner content as a reactive accessor and a `cmsProp` accessor that returns a spread-ready `data-cms-field` object. Spread `{...cmsProp()}` onto whichever element should be the click target. |

`data-cms-field` values are dot-separated field paths (e.g., `modules.0.content`) built from `CmsPathContext` + `property`. The `CmsPathContextProvider` wrapper sets the base path for nested content — use it when rendering list items or object fields inside modules so click-to-edit paths resolve correctly. `data-cms-field` attributes are inert outside the CMS preview iframe.

### ContentFor

`ContentFor` (`src/components/ContentFor.tsx`) combines SolidJS `<For>` with `CmsPathContextProvider` so list items automatically get correct dot-path context without manual path tracking. `field` is type-checked to only accept keys of `each` whose value is an array.

```tsx
// each = parent object, field = array key — path context set to "ctaList.0", "ctaList.1", …
<ContentFor each={props.shape} field="ctaList">
  {(cta) => (
    <Content content={cta} property="label" type="string">
      {(label, cmsProp) => <span {...cmsProp()}>{label()}</span>}
    </Content>
  )}
</ContentFor>
```

Props:

| Prop       | Type                                                | Description                                                          |
| ---------- | --------------------------------------------------- | -------------------------------------------------------------------- |
| `each`     | `TParent \| null \| undefined`                      | Parent object containing the array field                             |
| `field`    | `ArrayField<TParent>`                               | Key of `each` whose value is an array — type-checked at compile time |
| `source`   | `{ collection: string; slug: string } \| undefined` | When the array items belong to a different collection than the surrounding page (e.g. `flavor-categories/main` embedded in a page module), pass `source` so that click-to-edit focus messages include the correct collection and slug for cross-collection navigation |
| `children` | `(item: T, index: Accessor<number>) => JSX.Element` | Render function, same signature as `<For>` children                  |
| `fallback` | `JSX.Element`                                       | Optional fallback rendered when the array is empty                   |

### Click-to-edit

When rendered inside the Decap CMS preview iframe, `[data-cms-field]` elements become interactive: hovering shows a blue dashed outline and clicking sends a focus message to the Decap editor.

`setupCmsPreview` (`src/lib/utils/setupCmsPreview.ts`, called from `App` via `onMount`) handles the client side:

1. Detects iframe context via `window !== window.top` (with a `SecurityError` fallback for cross-origin frames).
2. Adds `body.cms-preview` — the CSS in `app.css` gates all hover/cursor styles behind this class so normal pages are unaffected.
3. Attaches a single delegated click listener on `document`. On click, walks up via `.closest("[data-cms-field]")`, then posts `{ type: "cms-field-focus", fieldPath }` to `window.top`. `fieldPath` is the dot-separated path from `data-cms-field` (e.g., `modules.0.content`).

`window.top` is required (not `window.parent`) because Decap wraps preview templates in its own `react-frame-component` iframe, creating three levels of nesting: admin window → Decap preview iframe → SolidStart iframe. `window.parent` would only reach the middle frame.

The admin side handles the message and focuses the editor field. See [admin/README.md](admin/README.md) for that half of the system.

### CMS message protocol

All cross-frame communication is typed through `src/lib/cms/messages.ts`. Three message types exist:

| Type | Payload | Direction |
| ---- | ------- | --------- |
| `cms-field-focus` | `{ fieldPath, collection?, slug? }` | iframe → admin window |
| `cms-route-change` | `{ path, source: "push" \| "replace" \| "pop" }` | iframe → admin window |
| `cms-preview-update` | `{ slug, data }` | admin window → iframe |

`dispatch(target, type, payload)` sends a typed message. `createMessageHandler(handlers)` returns a `MessageEvent` listener that routes incoming messages to the appropriate handler by type. Both are used on both sides of the frame boundary.

### Modules

`src/modules/` contains page-section components. Each module has a matching shape in `src/models/modules/` that uses `fields.object` to define its CMS fields.

`ModuleRegistry` (`src/modules/ModuleRegistry.tsx`) maps module type keys to their components and renders them via SolidJS `<Dynamic>`. `ModuleRegistryShape` (`src/models/ModuleRegistry.shape.ts`) collects all module shapes for use in `fields.list({ types: ModuleRegistryShape })` — this generates a Decap `list` widget with typed variants so editors can add, reorder, and configure individual modules.

Reusable sub-shapes (e.g., `LinkShape`) live in `src/models/components/` and are composed into module shapes via `fields.object`.

#### Leaf vs container modules

`BaseModuleRegistry.shape.ts` holds the *leaf* modules (modules that render content but cannot hold other modules): `HeroModule`, `FlavorMenuModule`, `GeneralModule`. `ModuleRegistryShape` re-exports `BaseModuleRegistryShape` and adds *container* modules (`GridModule`) on top.

`GridModule` references `baseModuleFieldGroups` directly (instead of `ModuleRegistryShape`) to avoid a circular dependency — containers hold leaves, not other containers.

#### Available modules

| Module | Shape | Description |
| ------ | ----- | ----------- |
| `HeroModule` | `HeroModule.shape.ts` | Full-width hero section with image and headline |
| `GeneralModule` | `GeneralModule.shape.ts` | Ordered list of submodules, each with a title, optional hero image, optional markdown body, and optional CTA list |
| `FlavorMenuModule` | `FlavorMenuModule.shape.ts` | Displays flavor categories and flavors fetched from the `flavor-categories` collection; supports a heading and footnote |
| `GridModule` | `GridModule.shape.ts` | Container that renders exactly two leaf modules side-by-side. Each item carries an `antecedent` integer that sets its `fr` proportion in CSS grid |

#### Scaffolding a new module

Use the `/scaffold-module <Name>` Claude command (`.claude/commands/scaffold-module.md`). It asks whether the module is a leaf or container, proposes a field list for confirmation, then creates the shape file, registers it, creates the component, and registers the component — in that order.

### Admin CMS

The Decap CMS interface runs as a separate Vite bundle on port 5174 in dev, proxied through the main server on port 5173. See [admin/README.md](admin/README.md) for full details on the proxy setup, HMR, live preview, and build process.

## Dev

```bash
npm install
npm run dev
```

Starts four processes via `concurrently`: SolidStart dev server, admin Vite dev server, `decap-server` (local Git backend), and the CMS config watcher.

## Build

```bash
npm run build
```

Runs in order: `generate:cms` → `build:admin` → `validate:content` → `vite build`.

Requires `.env` with:

```
CMS_GITHUB_REPO=owner/repo
CMS_GITHUB_BRANCH=main
```
