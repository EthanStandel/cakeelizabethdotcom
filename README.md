# cakeelizabeth.com

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

- `public/admin/config.yml` — generated Decap CMS config (gitignored, never hand-edited)
- Content validation — `validate:content` parses every `.md` file against the Zod schema at build time
- Typed content access — `getCollection` / `getCollectionItem` in `src/lib/content.ts` return fully-typed results

### Content fetching

The app fetches content from `/cms-manifest.json` at runtime — a static JSON file built from `public/content/`. Routes use `getCollection` / `getCollectionItem` for SSR and static rendering, and compose with `createCmsLiveContent` for live CMS preview.

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

| Prop | Type | Description |
|---|---|---|
| `content` | `T \| undefined` | The full content object (generic) |
| `property` | `keyof T & string` | Field name — type-checked against `T` |
| `type` | `"string" \| "markdown"` | `"string"` renders `<span>`, `"markdown"` renders `<div innerHTML>` via `marked` |
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

| Prop | Type | Description |
|---|---|---|
| `each` | `TParent \| null \| undefined` | Parent object containing the array field |
| `field` | `ArrayField<TParent>` | Key of `each` whose value is an array — type-checked at compile time |
| `children` | `(item: T, index: Accessor<number>) => JSX.Element` | Render function, same signature as `<For>` children |
| `fallback` | `JSX.Element` | Optional fallback rendered when the array is empty |

### Click-to-edit

When rendered inside the Decap CMS preview iframe, `[data-cms-field]` elements become interactive: hovering shows a blue dashed outline and clicking sends a focus message to the Decap editor.

`setupCmsPreview` (`src/lib/utils/setupCmsPreview.ts`, called from `App` via `onMount`) handles the client side:

1. Detects iframe context via `window !== window.top` (with a `SecurityError` fallback for cross-origin frames).
2. Adds `body.cms-preview` — the CSS in `app.css` gates all hover/cursor styles behind this class so normal pages are unaffected.
3. Attaches a single delegated click listener on `document`. On click, walks up via `.closest("[data-cms-field]")`, then posts `{ type: "cms-field-focus", fieldPath }` to `window.top`. `fieldPath` is the dot-separated path from `data-cms-field` (e.g., `modules.0.content`).

`window.top` is required (not `window.parent`) because Decap wraps preview templates in its own `react-frame-component` iframe, creating three levels of nesting: admin window → Decap preview iframe → SolidStart iframe. `window.parent` would only reach the middle frame.

The admin side handles the message and focuses the editor field. See [admin/README.md](admin/README.md) for that half of the system.

### Modules

`src/modules/` contains page-section components (e.g., `HeroModule`). Each module has a matching shape in `src/models/modules/` that uses `fields.object` to define its CMS fields.

`ModuleRegistry` (`src/modules/ModuleRegistry.tsx`) maps module type keys to their components and renders them via SolidJS `<Dynamic>`. `ModuleRegistryShape` (`src/models/ModuleRegistry.shape.ts`) collects all module shapes for use in `fields.list({ types: ModuleRegistryShape })` — this generates a Decap `list` widget with typed variants so editors can add, reorder, and configure individual modules.

Reusable sub-shapes (e.g., `LinkShape`) live in `src/models/components/` and are composed into module shapes via `fields.object`.

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
