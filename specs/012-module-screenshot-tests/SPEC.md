# 012 — Module screenshot tests

| | |
| --- | --- |
| Status | Implemented |
| Depends on | [000](../000-initial/SPEC.md), [001](../001-design-v2-modules/SPEC.md), [002](../002-design-v2-header-footer/SPEC.md), [004](../004-module-transitions/SPEC.md), [005](../005-contact-form-email/SPEC.md) |
| Snapshot | 2026-10-21, commit `e39b963` |

## Description

The project had no tests. This spec adds screenshot tests: every module in the registry ([000§13.1](../000-initial/SPEC.md#131-registry)), the header and the footer are rendered with fixed props and compared, pixel for pixel, with a committed baseline at a desktop and a mobile width. A change that alters how any of them looks fails a test until the baseline is updated on purpose.

The tests check how a component looks for the props it is given. They do not check the path from CMS content to those props.

## 1. Tooling

Vitest in browser mode, with Playwright driving Chromium (`@vitest/browser-playwright`), configured in `vitest.config.ts`. A test file is bundled by Vite and runs in the browser, so a test imports the component it captures and renders it as JSX, with the props written inline:

```tsx
testScreenshot("left", () => <HeroModule shape={{ eyebrow: "Custom Cakes", content: "# Cakes" }} />);
```

There is no registry of fixtures and no page that renders them: the test file is the fixture.

`vitest.config.ts` is separate from `vite.config.ts`, because the app's config builds a SolidStart server with Nitro and the tests need only the browser side. It has Tailwind, `vite-plugin-solid` (a direct dev dependency, not only the copy SolidStart brings) and the `~` alias. It sets `environment: "node"` although no test runs in Node: left unset, `vite-plugin-solid` fills in `jsdom`, and Vitest then asks to install jsdom on every interactive run even though browser mode never uses it. Vite serves `public/` as usual, so `/test/test.png` and the generated content are both available.

Each test sits beside what it captures, as a `*.test.tsx` file in the component's directory (`src/modules/HeroModule/HeroModule.test.tsx`, `src/components/Header/Header.test.tsx`), and its baselines in a `__screenshots__` folder in the same directory, named `<case>-<instance>-<platform>.png`. A change to a module and the change to its baselines show up side by side. The actual and diff images of a failed comparison go to `.vitest/`, which is ignored.

A tested component has a directory of its own, so that its test and baselines are not mixed with its neighbors'. The modules that were single files, `HeroModule`, `GridModule`, `GeneralModule`, `HorizontalListModule`, `FlavorMenuModule`, `FlavorCombinationsModule` and `VerticalStepperModule` in `src/modules/`, and `Footer` in `src/components/`, moved into a directory of the same name holding the component and an `index.ts` that re-exports it, as `GalleryModule` already did. Their importers are unchanged, since an import of `./HeroModule` resolves to the directory's `index.ts`.

| Script | Runs |
| --- | --- |
| `npm test` | Every test, against the baselines, after `generate:cms:dev` writes the content manifest |
| `npm run test:update` | Every test, rewriting the baselines that differ |

Baselines are generated and checked on macOS only. Font rendering differs between operating systems, so a baseline made on one fails on another; each baseline is named with the platform (`-darwin`), so a run elsewhere reports missing baselines rather than false differences.

## 2. The render helper

`src/test/utils.tsx`, imported as `~/test/utils`, holds what the tests share.

| Export | Does |
| --- | --- |
| `render(ui)` | Renders `ui()` into a fresh container and waits for it to settle ([§3.3](#33-stable-pixels)); returns a locator for the container |
| `settle()` | Waits until no fetch is in flight, the fonts have loaded and every image has decoded |
| `expectScreenshot(locator, name)` | Compares the element with its baseline |
| `testScreenshot(name, ui)` | A test that renders `ui` and compares the container with the baseline `name` |

`render` wraps the component in what the app's root provides and the components read: a `MemoryRouter` for links and `useLocation`, `SiteWideProvider` for the constants and navigation ([000§7.1](../000-initial/SPEC.md#71-fetching)), and a `Suspense` boundary. Importing the helper also brings in `app.css` and marks `<body>` as the `@container` that the `@dsk` variants resolve against, as `entry-server.tsx` does ([000§11.2](../000-initial/SPEC.md#112-responsive-model)).

Props are typed by the module's shape. A shape infers each optional field as a required key that may be `undefined`, so a test leaving fields out casts its object with `as` the module's type.

Every image a test supplies is `/test/test.png`.

The gallery fetches its items and tags rather than taking them as props, so `GalleryModule.test.tsx` mocks `getCollectionItem` in `src/lib/content.ts` to answer those two collections with fixed content: eight items over three tags, every image `/test/test.png`. Each item's address carries a different query (`?item=0`, `?item=1`, …), because the gallery derives a tile's height from its image address and keys its items by it. Other collections are fetched as usual.

`GridModule` renders its items through `ModuleRegistry`, which imports `GridModule` back. The app always loads the registry first; `GridModule.test.tsx` imports `../ModuleRegistry` before `./GridModule` for the same order, since the other order reads `GridModule` before it is defined.

## 3. What is captured

### 3.1 Instances

| Instance | Viewport |
| --- | --- |
| `desktop` | 1280 × 900 |
| `mobile` | 390 × 844 |

Every test runs in both. Each module's layout differs across the one breakpoint ([GAC§9](../GLOBAL_ACCEPTANCE_CRITERIA.md)), and both widths sit well away from it.

### 3.2 Cases

| Component | Cases |
| --- | --- |
| `HeroModule` | Left-aligned with an eyebrow and two CTAs; centered with a rule above; with a background image |
| `GridModule` | Flavor menu beside general; general beside general with a hero image |
| `GeneralModule` | Several submodules |
| `HorizontalListModule` | With a heading and enumerated; without a heading, not enumerated |
| `FlavorMenuModule` | Columns; stacked |
| `FlavorCombinationsModule` | With a CTA |
| `VerticalStepperModule` | Four steps |
| `GalleryModule` | Every tag; a preset tag, which shows only that tag's items |
| `ContactFormModule` | Empty; invalid; sent |
| `Header` | Closed; menu open (mobile only, where the toggle is shown) |
| `Footer` | As rendered |

| State | How it is reached |
| --- | --- |
| Contact form: invalid | Submitting the empty form, which shows each required field's error |
| Contact form: sent | Filling the form validly and submitting it, which shows the sent panel ([005§5.2](../005-contact-form-email/SPEC.md#52-sent)). `submitContactForm` is mocked to succeed, since no server answers `/api/contact` |
| Header: menu open | Pressing the menu toggle. The header is rendered inside a `min-h-dvh` wrapper, as the app's root renders it, and the wrapper is captured, because the open menu overflows `<header>` to fill the viewport |

### 3.3 Stable pixels

- The browser emulates `prefers-reduced-motion: reduce`, which turns off the modules' arrival ([004](../004-module-transitions/SPEC.md)), and the screenshot option disables animations and hides the text caret.
- `settle` waits for two frames in a row with no fetch in flight, since one finished fetch often starts the next (the manifest, then each entry it lists). It then waits for the fonts and for every image to decode. The gallery fills its columns only in the browser ([000§14](../000-initial/SPEC.md#14-gallery-module)), so its images arrive after the first render.
- The test page is an iframe the size of the viewport, and what lies below its fold is never painted. Before comparing an element taller than the viewport, `expectScreenshot` grows the viewport to the element's height and restores it when the test ends.
- The page hides its scrollbar, which would otherwise take width from the mobile viewport.
- Vitest compares only once two screenshots in a row match, so a state still changing, such as the contact form's errors growing in, is not captured midway.

## Known gaps

- **Some baselines follow the site's content.** `FlavorMenuModule`, `Header` and `Footer`, and the flavor menu inside a `GridModule` case, fetch collections rather than take everything as props, so they render the site's flavors, navigation and constants. An edit to that content in the CMS changes their baselines.
- **Only Chromium is captured.** Safari and Firefox render differently and are not tested.
- **Not run in CI.** The baselines are macOS ones ([§1](#1-tooling)), so a CI run on Linux would need its own set.
- **The gallery modal and hover states are not captured.** The modal is not a module ([000§15](../000-initial/SPEC.md#15-gallery-modal)), and hover and focus styles would need a case each.
