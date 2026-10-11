This file covers how to work in this repository: git, edits, the spec workflow and code style. Architecture and behavior live in the specs, starting from [README.md](README.md).

## Git staging

NEVER change what is staged without asking first. The index is curated by hand, and what is staged versus unstaged is deliberate. That rules out `git add`, `git restore --staged`, `git reset`, `git rm`, `git mv`, `git stash`, `git commit`, and any other command that stages, unstages or rewrites the index, unless the request for it came in the current conversation. Edit files in the working tree only and leave the result unstaged. If a task seems to need a staging change, stop and ask.

## Editing files

Files are frequently edited by hand between turns, so what was read earlier in a conversation may be stale. Always re-read a file immediately before modifying it, and build the edit on what is there now. Never revert a change you didn't make: if the file differs from what you last saw, that difference is deliberate, so keep it and work around it. If it conflicts with the task, stop and ask.

Prefer targeted edits over full-file overwrites. Rewrite a whole file only when creating it or when nearly every line changes.

### Markdown tables

Write each table row with exactly one space between a `|` and the cell's content, and `---` for each column of the separator row. Never pad cells to line the columns up: padding makes a change to one cell rewrite every row, so the whole table shows as modified in a diff. In a table that is already padded, write only the rows you add or change this way and leave the others untouched. Do not run Prettier, or any formatter that aligns tables, over a Markdown file.

## Specs

Every engineering and product decision is recorded in a spec. Each spec document has its moment to be read:

- **Before changing a feature**, read its spec at `specs/NNN-feature-name/SPEC.md` (indexed in [README.md](README.md#specs)), including "Known gaps". It records why non-obvious details exist (e.g. the gallery filter animation's ordering and timing) and which problems are already known.
- **Before any frontend build-out**, read [specs/GLOBAL_ACCEPTANCE_CRITERIA.md](specs/GLOBAL_ACCEPTANCE_CRITERIA.md): the architectural rules every main-application feature must meet, such as CMS-sourced strings, click-to-edit, server rendering, URL state and modules.
- **Before writing or editing a spec**, read [specs/SPEC_CONVENTIONS.md](specs/SPEC_CONVENTIONS.md): where specs live, what the header holds, and how paths, sections and criteria are cited.

Document a feature before implementing it: when a product change is requested, write it into the spec first and then build it. A change that is only layout, spacing, style, design or aesthetic can be made directly.

When a change alters behavior a spec describes, update that spec in the same change: the body, "Known gaps" (remove what was fixed, add what was found), and the status and snapshot rows in its header. A new feature gets a new spec under the next number.

When referring to a spec section (`§N` or `§N.M`) in a reply to the user, link it to the spec file at the heading's line, e.g. `[§4.1](specs/000-initial/SPEC.md:88)`, so the section can be opened directly. A criterion (`GAC§N`) links to its line the same way, e.g. `[GAC§3](specs/GLOBAL_ACCEPTANCE_CRITERIA.md:9)`. Never mention a section number bare.

## Playwright screenshots

When taking screenshots with the Playwright MCP server, always pass a filename with the `.playwright-mcp/` directory prefix (e.g. `filename: ".playwright-mcp/my-screenshot.png"`) so they don't land in the project root.

## Code conventions

These are the conventions no spec carries. Architectural rules live in the [global acceptance criteria](specs/GLOBAL_ACCEPTANCE_CRITERIA.md) and are not repeated here; that includes sourcing every perceivable string from the CMS ([GAC§1](specs/GLOBAL_ACCEPTANCE_CRITERIA.md)) and click-to-edit on every rendered CMS value ([GAC§2](specs/GLOBAL_ACCEPTANCE_CRITERIA.md)).

### Tailwind responsive variants

Use desktop styles as defaults and `@max-dsk:` to override on mobile. Use `@dsk:` when a style only applies at desktop. Never use `sm:` / `max-sm:` or other built-in Tailwind breakpoints — `@dsk` and `@max-dsk` are the only responsive variants in this project. How the variants resolve against the viewport is in [000§11.2](specs/000-initial/SPEC.md#112-responsive-model).

### Magic numbers

When a magic number is externalized into a named constant, every place that depends on that value must reference the constant explicitly (e.g. `style={{ height: CONST }}`) rather than reproducing it implicitly (e.g. via padding/spacing utility classes that happen to add up to the same value). No implicit ties to an externalized constant.

### Class composition

Always use `cx` from `cva` (i.e. `import { cx } from "cva"`) for dynamic/conditional class name composition. Never build class strings with template literals, `classnames`/`clsx`, array joins, or manual ternaries concatenated into a string.

### Inline styles

Prefer Tailwind utility classes (composed via `cx`, see above) over the `style` prop. A conditional that toggles between a small, known set of values (e.g. `opacity() ? "1" : "0"`, a transform between two fixed states, a background/box-shadow on/off) must be expressed as conditional Tailwind classes instead of an inline style — including via Tailwind's arbitrary-property syntax (e.g. `[view-transition-name:foo]`) when no built-in utility exists.

`style` is only for values that are genuinely computed at runtime and can't be enumerated as a fixed set of classes — continuous drag offsets, ResizeObserver-derived heights, per-item computed aspect ratios, or a view-transition-name keyed by a dynamic id. The externalized-constant exception from [Magic numbers](#magic-numbers) still applies: `style={{ height: CONST }}` (or a CSS custom property bridging a JS constant into a Tailwind arbitrary value, e.g. `--desktop-cols`) is correct where the alternative would hardcode that constant's value into a class.

### Naming

Prefer full name descriptors over abbreviations, e.g. `viewTransition` (or `transition` for a short-lived variable) instead of `vt`, `intersectionObserver` (or `observer` for a short-lived variable) instead of `ro`.

Allowlisted shortenings (rare exceptions): `dsk` (desktop), `mbl` (mobile).

### Comments

No inline comments. Comments may only appear directly above a function declaration, and only to note a non-obvious default or behavior choice (e.g. `createBreakpoint` defaults to mobile on server renders) — never to restate what the function does. Prefer a self-documenting function name over a comment explaining behavior.

### File and JSX size limits

A file stays within 500 lines and a single JSX block within 150. Past either limit, extract:

- What only one component uses goes beside it, in a directory named after that component (e.g. `ComponentName/ComponentName.tsx` plus its helpers). An extracted component may instead stay in the same file while the file limit holds.
- A standardized, broadly reusable utility goes in `src/lib/utils`; a component likely to be reused goes in `src/components`.
