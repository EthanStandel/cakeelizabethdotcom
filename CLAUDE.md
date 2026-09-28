See [README.md](README.md) and subfiles within for project architecture and conventions.

## Playwright screenshots

When taking screenshots with the Playwright MCP server, always pass a filename with the `.playwright-mcp/` directory prefix (e.g. `filename: ".playwright-mcp/my-screenshot.png"`) so they don't land in the project root.

## Tailwind responsive conventions

Use desktop styles as defaults and `@max-dsk:` to override on mobile. Use `@dsk:` when a style only applies at desktop. Never use `sm:` / `max-sm:` or other built-in Tailwind breakpoints — `@dsk` and `@max-dsk` are the only responsive variants in this project.

`@dsk` is a container query variant generated from `--container-dsk: 1024px` in `@theme`. `<body>` carries `@container`, so all `@dsk:` / `@max-dsk:` variants resolve against the viewport.

## Magic numbers

When a magic number is externalized into a named constant, every place that depends on that value must reference the constant explicitly (e.g. `style={{ height: CONST }}`) rather than reproducing it implicitly (e.g. via padding/spacing utility classes that happen to add up to the same value). No implicit ties to an externalized constant.

## Class composition

Always use `cx` from `cva` (i.e. `import { cx } from "cva"`) for dynamic/conditional class name composition. Never build class strings with template literals, `classnames`/`clsx`, array joins, or manual ternaries concatenated into a string.

## Inline styles

Prefer Tailwind utility classes (composed via `cx`, see above) over the `style` prop. A conditional that toggles between a small, known set of values (e.g. `opacity() ? "1" : "0"`, a transform between two fixed states, a background/box-shadow on/off) must be expressed as conditional Tailwind classes instead of an inline style — including via Tailwind's arbitrary-property syntax (e.g. `[view-transition-name:foo]`) when no built-in utility exists.

`style` is only for values that are genuinely computed at runtime and can't be enumerated as a fixed set of classes — continuous drag offsets, ResizeObserver-derived heights, per-item computed aspect ratios, or a view-transition-name keyed by a dynamic id. The externalized-constant exception from [Magic numbers](#magic-numbers) still applies: `style={{ height: CONST }}` (or a CSS custom property bridging a JS constant into a Tailwind arbitrary value, e.g. `--desktop-cols`) is correct where the alternative would hardcode that constant's value into a class.

## Naming conventions

Prefer full name descriptors over abbreviations, e.g. `viewTransition` (or `transition` for a short-lived variable) instead of `vt`, `intersectionObserver` (or `observer` for a short-lived variable) instead of `ro`.

Allowlisted shortenings (rare exceptions): `dsk` (desktop), `mbl` (mobile).

## Comments

No inline comments. Comments may only appear directly above a function declaration, and only to note a non-obvious default or behavior choice (e.g. `createBreakpoint` defaults to mobile on server renders) — never to restate what the function does. Prefer a self-documenting function name over a comment explaining behavior.

## CMS-driven strings

Any string a sighted or assistive-technology user might perceive (visible text, `alt`, `aria-label`, `title`, etc.) must come from the CMS, not be hardcoded in a component. One-off strings that don't belong to a specific content collection (e.g. UI labels like a close button's accessible name) should be added to `constants` (see `src/models/Constants.shape.ts` / `src/primitives/ConstantsContext.tsx`) rather than inlined.

## Click-to-edit

Every value rendered from the CMS must carry `data-cms-*` click-to-edit props on the most sensibly relevant element — the element a user would actually want to click to edit that value (e.g. the chip showing a tag, not some unrelated wrapper). Use `Content` / `ContentFor` / `useCmsFieldProps` from `~/lib/cms/CmsPathContext` to derive these props rather than hand-rolling `data-cms-field` — hand-rolled paths silently drift from the ambient `CmsPathContextProvider`/`CmsSourceContextProvider` established by a parent and break click-to-edit. When nesting `ContentFor`/`Content` inside a context that already established the correct collection and path, do not pass a redundant `source` — only pass `source` when establishing a genuinely new root.

## File and JSX size limits

Files must not exceed 500 lines. If a file grows past that, break it up:

- Standardized, broadly-reusable utilities go in `src/lib/utils`.
- Utilities with no use outside a single component go alongside it in a directory named after the component (e.g. `ComponentName/ComponentName.tsx` plus its helpers).

Any single JSX block must not exceed 150 lines. If more is needed, extract a separate component instead of growing the block. That component can live in the same file (as long as the 500-line file limit still holds), or be broken out following the same rules as above: an adjacent file/directory if it has no use outside the parent component, or `src/components` if it's likely reusable.
