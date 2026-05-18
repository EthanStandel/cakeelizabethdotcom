# cakeelizabeth.com

SolidStart site with an aggressively customized Decap CMS admin interface. Content is stored as Markdown files in `public/content/` and committed to the repo.

## Architecture

```
src/          SolidStart app (routes, components, lib, models)
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

// Render prop — caller controls the outer element; Content provides the inner node and the field name
<Content content={page} property="title" type="string">
  {(span, field) => <h1 data-cms-field={field}>{span}</h1>}
</Content>
```

Props:

| Prop | Type | Description |
|---|---|---|
| `content` | `T \| undefined` | The full content object (generic) |
| `property` | `keyof T & string` | Field name — type-checked against `T` |
| `type` | `"string" \| "markdown"` | `"string"` renders `<span>`, `"markdown"` renders `<div innerHTML>` via `marked` |
| `children` | `(element, cmsField) => JSX.Element` | Optional render prop. Receives the inner element (no `data-cms-field`) and the field name string so the caller can place `data-cms-field` wherever makes sense (e.g., on a wrapping `<button>` or `<h1>`). |

`data-cms-field` attributes are inert outside the CMS. The click-to-edit behavior only activates inside the Decap preview iframe.

### Click-to-edit

When rendered inside the Decap CMS preview iframe, `[data-cms-field]` elements become interactive: hovering shows a blue dashed outline and clicking sends a focus message to the Decap editor.

`setupCmsPreview` (called from `App` via `onMount`) handles the client side:

1. Detects iframe context via `window !== window.top` (with a `SecurityError` fallback for cross-origin frames).
2. Adds `body.cms-preview` — the CSS in `app.css` gates all hover/cursor styles behind this class so normal pages are unaffected.
3. Attaches a single delegated click listener on `document`. On click, walks up via `.closest("[data-cms-field]")`, then posts `{ type: "cms-field-focus", fieldName }` to `window.top`.

`window.top` is required (not `window.parent`) because Decap wraps preview templates in its own `react-frame-component` iframe, creating three levels of nesting: admin window → Decap preview iframe → SolidStart iframe. `window.parent` would only reach the middle frame.

The admin side handles the message and focuses the editor field. See [admin/README.md](admin/README.md) for that half of the system.

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
