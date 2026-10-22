# 006 — not-found page

| | |
| --- | --- |
| Status | Implemented |
| Depends on | [000](../000-initial/SPEC.md), [001](../001-design-v2-modules/SPEC.md), [002](../002-design-v2-header-footer/SPEC.md), [003](../003-universal-suffix-modules/SPEC.md), [004](../004-module-transitions/SPEC.md) |
| Snapshot | 2026-10-13, commit `146b071fe94efcdb8aec5eb9d9c32c232174eb75` |

## Description

An address that matches no page shows one heading from the constants, and on some addresses the starter's paragraph about SolidStart under it ([000§10](../000-initial/SPEC.md#10-site-shell-and-routes)). This spec replaces that with the designed not-found page: an eyebrow, a large "404", a heading, and a button back to the home page. Its content moves out of the constants into an entry of its own, the two routes that show it share one component, and the entry is previewed in the admin at an address reserved for it.

## 1. Source design

The design is the file `Cake Elizabeth 404.html` in the Claude Design project of [001§1](../001-design-v2-modules/SPEC.md#1-source-design). It holds two artboards, one desktop and one mobile, so the mobile layout is drawn here and not derived by wrapping.

Both artboards show the view alone in an empty frame. The site draws the header and the footer around it as it does around every page ([002](../002-design-v2-header-footer/SPEC.md)).

What is taken from the design is what [001§1](../001-design-v2-modules/SPEC.md#1-source-design) takes from its own: the engineering decisions, and not the spacing, sizes, or type values. The tokens of [000§11.1](../000-initial/SPEC.md#111-tokens) stand for the design's colors.

## 2. Content type

The collection is `not-found` in `src/models/NotFound.shape.ts`, exported as `NotFoundShape` and added to `collectionRegistry` ([000§6.6](../000-initial/SPEC.md#66-collections)). It is a singleton as the universal suffix modules are ([003§1](../003-universal-suffix-modules/SPEC.md#1-content-type)): `create: false`, the identifier `name`, and one entry at `public/content/not-found/main.md`. Unlike the other singletons it has a `previewPath` ([§5](#5-reserved-address)).

| Field | Holds | Initial value |
| --- | --- | --- |
| `name` | The entry's name in the admin | "Not Found" |
| `title` | The document's `<title>` | "Page not found" |
| `eyebrow` | The eyebrow above the numeral | "Page not found" |
| `code` | The large numeral | "404" |
| `heading` | The page's heading | "Cake not found." |
| `ctaList` | The link buttons under the heading | One primary link, "Back to home", to `/` |

The four strings carry their initial value as the field's default.

The content has an entry of its own and is not added to the constants, which held the not-found title and heading until now ([000§7.3](../000-initial/SPEC.md#73-constants)). The constants are the strings of controls that appear across the site. This is the whole content of one view, and an entry of its own can be opened in the admin and previewed as that view ([§5](#5-reserved-address)), which a group of fields among the constants cannot. `notFoundTitle` and `notFoundHeading` are removed from `src/models/Constants.shape.ts` and from `public/content/constants/main.md`; `title` and `heading` take their place.

`code` is a field although the status it shows never changes. It is text a visitor reads, so it comes from the CMS like the rest ([GAC§1](../GLOBAL_ACCEPTANCE_CRITERIA.md)). The status the server answers with is not read from it ([§3](#3-the-view)).

`ctaList` is built as the hero's is, a list whose single variant is `link` ([000§6.6](../000-initial/SPEC.md#66-collections)), and not as a label with a fixed target. The design draws one button in a row made to hold several, and the shared `CtaList` already renders such a row ([001§3.12](../001-design-v2-modules/SPEC.md#312-shared-components)). An editor can therefore point the button elsewhere or add a second one, and the home page's address is authored as any other link target is.

The design's title carries the site name after a dash. The pages' titles do not ("Gallery", "Contact"), so the entry's is written without it.

## 3. The view

The view is `NotFound` in `src/components/NotFound.tsx`. It is everything a not-found address renders: the `<title>`, the 404 status, and a `<main>` holding one `<section>`. In reading order the section holds:

- the eyebrow, in the shared `Eyebrow` ([000§12](../000-initial/SPEC.md#12-shared-components));
- the numeral, a paragraph and not a heading;
- the heading, the page's `h1`;
- the buttons, in `CtaList`.

Each of the three strings is rendered through `Content`, and the buttons through `CtaList`, inside a `CmsSourceContextProvider` for the entry ([000§8.1](../000-initial/SPEC.md#81-path-and-source-context)), so every value on the view is a click-to-edit target ([GAC§2](../GLOBAL_ACCEPTANCE_CRITERIA.md)). A field with no value renders nothing, and the view is drawn from whatever the entry holds ([GAC§4](../GLOBAL_ACCEPTANCE_CRITERIA.md)). The `<title>` has no fallback string.

The status is set by `HttpStatusCode` with the number 404, written in the component. It is a fact about the response and not content, and it does not follow the `code` field.

The view renders no suffix modules, as the view it replaces did not ([003§3](../003-universal-suffix-modules/SPEC.md#3-rendering)), and no link of the header is current on it ([002§2.3](../002-design-v2-header-footer/SPEC.md#23-current-page)).

### 3.1 Content access

`NotFound` reads the entry itself with `createCmsContent` ([000§7.2](../000-initial/SPEC.md#72-primitives)), as `UniversalSuffixModules` reads its own ([003§3](../003-universal-suffix-modules/SPEC.md#3-rendering)), so the view follows live preview. The entry is not provided to the whole app as the constants and the navigation are ([002§2.2](../002-design-v2-header-footer/SPEC.md#22-navigation-model)): most visits never draw the view, and a provider would fetch the entry for every one of them.

A navigation inside the app to an address with no page waits for the entry as it waits for a page's content ([004§4.3](../004-module-transitions/SPEC.md#43-arriving)), so the address, the scroll, and the view change together and the view is whole when it arrives.

That navigation showed a fault in `createCmsContent`. Its store kept the entry of the slug before it when a fetch found none, and the store was answered ahead of the fetch ([004§4.3](../004-module-transitions/SPEC.md#43-arriving)), so a link from a page to an address with no page changed the address and drew the page that had been left. A fetch that finds no entry now answers with nothing, whatever the store holds. A live preview is the exception: a draft of an entry that is not yet saved has no fetch behind it and is still drawn.

### 3.2 Layout

The view is centered between the header and the footer, across and down, as the design centers it in its frame. On a window taller than the view the spare height is shared above and below it, and the footer stays at the bottom of the window ([002§3](../002-design-v2-header-footer/SPEC.md#3-footer)). On a window too short for that, the view keeps the module gap above and below it ([GAC§12](../GLOBAL_ACCEPTANCE_CRITERIA.md)) and the page scrolls.

For the view to be centered down the window, its `<main>` has to be as tall as the space the shell leaves for the route. The box in `src/app.tsx` that took the spare height ([002§3](../002-design-v2-header-footer/SPEC.md#3-footer)) is removed, so a route's `<main>` is itself an item of the column that holds the route and the footer, and the view's `<main>` grows to fill it. A page's `<main>` does not grow. What holds the footer at the bottom of a short page is now the footer's own top margin, which takes the spare height when nothing above it does, so pages are laid out as they were.

The section's width and gutters are `page-container` and `content-container` ([000§11.4](../000-initial/SPEC.md#114-utilities-and-base-styles)). Its text block is as wide as a centered hero's and is centered the same way, text and button row alike ([001§3.1](../001-design-v2-modules/SPEC.md#31-hero-centered-alignment-and-rule)). The space between its four blocks is `block-padding`.

The heading takes the `h1` element default and the eyebrow and buttons the sizes of their shared components. The design draws the heading smaller than that default; the default is kept, so the page's heading is the size every page's is.

The numeral is set as a heading is, in the serif face and the heading color, and italic as an `h2` is. It is larger than any step of Tailwind's type scale, so it is set at 12.5 rem with an arbitrary value in `NotFound.tsx`. It is not a token in `src/app.css`, as [GAC§9](../GLOBAL_ACCEPTANCE_CRITERIA.md) would have a new value be, because nothing else on the site is drawn at that size and the view is the only one of its kind. On mobile it is `text-9xl`, the scale's largest step.

On mobile a `LinkButton` stretches across its row ([000§12](../000-initial/SPEC.md#12-shared-components)), which is the full-width button the mobile artboard draws. Nothing else differs between the two widths, and nothing in the view depends on a script to be laid out ([GAC§6](../GLOBAL_ACCEPTANCE_CRITERIA.md)).

### 3.3 Motion

The view is one step of the module sequence of [004§1](../004-module-transitions/SPEC.md#1-what-moves), which until now said that the not-found view does not move. `NotFound` wraps its section in `ModuleTransition` at position 0, so the view behaves as a page with one module does:

- on a page load it arrives ([004§3](../004-module-transitions/SPEC.md#3-arriving-on-a-page-load));
- on a navigation inside the app to an address with no page, the modules of the page being left go out and the view arrives in their place ([004§4.3](../004-module-transitions/SPEC.md#43-arriving));
- when its button or a link of the header is followed, the view leaves first and the navigation is held until it is out ([004§4.2](../004-module-transitions/SPEC.md#42-leaving)).

Reduced motion removes all three ([004§5](../004-module-transitions/SPEC.md#5-reduced-motion)).

The wrapper needs the state `ModuleTransitionProvider` holds ([004§4](../004-module-transitions/SPEC.md#4-leaving-and-arriving-on-a-navigation)). The page route already provides it. The catch-all route does not, so it wraps the view in a provider of its own ([§4](#4-routes)).

## 4. Routes

Two routes show the view, as two showed the one it replaces ([000§10](../000-initial/SPEC.md#10-site-shell-and-routes)), and both now render `NotFound` and nothing else of their own:

| Route | When |
| --- | --- |
| `src/routes/[[slug]].tsx` | The address is one segment and no page has that slug, or the slug is the reserved one ([§5](#5-reserved-address)) |
| `src/routes/[...404].tsx` | The address is one the page route does not match, which is any of more than one segment |

The page route renders the view where it rendered its own copy of the heading, inside its `ModuleTransitionProvider`. The catch-all route renders the view inside a `ModuleTransitionProvider` that it creates. The provider of one route does not outlast a navigation to the other: the view still leaves before such a navigation and the destination's modules still arrive, because each side plays its own half.

The catch-all route loses the starter's paragraph and its link to start.solidjs.com, which were written into the component. With one component behind both routes, the not-found markup is no longer written twice. Both were listed in [000](../000-initial/SPEC.md#known-gaps)'s known gaps.

The catch-all route's `preload` warms the entry, and the page route's does when the slug is the reserved one. For any other slug the page route cannot know before the page's fetch returns whether the view will be needed, so it warms only the page.

## 5. Reserved address

The entry's `previewPath` is `/404`, whatever the slug, so opening the entry in the admin shows the view in the preview ([000§9.2](../000-initial/SPEC.md#92-preview-component)), an edit to a field shows there as it is made, and a click on any part of the view focuses its field ([000§9.6](../000-initial/SPEC.md#96-click-to-edit-focusing-the-editor-field)). With `previewPath: null` the admin would have kept the preview on whichever page was open last, and an editor would have had to type an address that matches nothing to see what they were editing.

The slug `404` and the path are two constants in `NotFound.shape.ts`, `NOT_FOUND_PAGE_SLUG` and `NOT_FOUND_PATH`, the second built from the first, as `HOME_PAGE_SLUG` and `HOME_PAGE_PATH` sit beside the page's shape ([002§2.1](../002-design-v2-header-footer/SPEC.md#21-logo)). The `previewPath` and the page route both reference them.

The address is reserved and not merely unused. The page route renders the view for that slug without looking for a page, as it handles the `home` slug before it looks for one ([001§3.8](../001-design-v2-modules/SPEC.md#38-home-page)). A page that an editor titles "404" would otherwise take the address, and the entry's preview would show that page with no sign of why. Such a page can still be created and is never shown.

`/404` answers with the 404 status like any other not-found address, so it is the view's address in the admin and not a page of the site.

## Known gaps

- **The tab's title is empty while the entry loads.** On a navigation inside the app to a not-found address, the title of the page being left is removed when the router starts on the view, and the view's title is set when the entry has loaded ([§3.1](#31-content-access)). The page itself is not affected: its modules are out by then, and the view arrives whole.
