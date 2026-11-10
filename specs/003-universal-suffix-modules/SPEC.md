# 003 — universal suffix modules

| | |
| --- | --- |
| Status | Implemented |
| Depends on | [000](../000-initial/SPEC.md), [001](../001-design-v2-modules/SPEC.md), [002](../002-design-v2-header-footer/SPEC.md) |
| Snapshot | 2026-10-12, commit `213aaecd9ef4f8ec00e347f9dc0f1d694b9d37ba` |

## Description

Some sections belong at the bottom of every page and not to any one of them. The first is the "Ready to begin?" banner of [001§3.1](../001-design-v2-modules/SPEC.md#31-hero-centered-alignment-and-rule), which was authored separately on the Home and Weddings pages and was missing from the rest. This spec adds a content type that holds such modules once, renders them after each page's own modules, and lets chosen pages go without them.

## 1. Content type

The collection is `universal-suffix-module` in `src/models/UniversalSuffixModule.shape.ts`, exported as `UniversalSuffixModuleShape` and added to `collectionRegistry` ([000§6.6](../000-initial/SPEC.md#66-collections)). It is a singleton as the constants and the navigation are ([002§2.2](../002-design-v2-header-footer/SPEC.md#22-navigation-model)): `create: false`, the identifier `name`, no `previewPath`, and one entry at `public/content/universal-suffix-module/main.md`.

| Field | Holds |
| --- | --- |
| `name` | The entry's name in the admin |
| `modules` | The suffix modules, in order: a list of the `ModuleRegistryShape` types, as a page's `modules` is |
| `excludedSlugs` | The pages that are rendered without the suffix modules ([§2](#2-excluded-pages)) |

What closes a page is a module and not a component of its own ([GAC§8](../GLOBAL_ACCEPTANCE_CRITERIA.md)). `modules` takes the same registry a page does and not only the leaves, so anything an editor can put on a page, a grid included, can be a suffix module, and a module added to the registry later is available here with no further change.

## 2. Excluded pages

`excludedSlugs` is a list of page slugs. A page whose slug is in it is rendered without any of the suffix modules: the exclusion is of the whole set and not module by module. The home page is listed by its slug, `home` ([001§3.8](../001-design-v2-modules/SPEC.md#38-home-page)), and not by its path.

The list is held on this entry and not as a flag on each page, so the exceptions are read and changed in one place, beside the modules they apply to.

The field is a `fields.relation` to the `page` collection ([000§6.1](../000-initial/SPEC.md#61-field-builders)) with `multiple` on. Its stored value is the page entry's slug (`{{slug}}`), and its options are shown and searched by the page's `title`. An editor therefore picks from the pages that exist and does not type a slug, where a typo would silently exclude nothing. It is the first field built with the relation builder. A slug left in the list after its page is deleted matches no page and does no harm.

The list starts with `contact`. The banner sends visitors to the Contact page, so that page has no use for it.

## 3. Rendering

`UniversalSuffixModules` in `src/components/UniversalSuffixModules.tsx` reads the entry and renders its modules through `ModuleRegistry` ([000§13.1](../000-initial/SPEC.md#131-registry)), so a module is drawn the same whether a page or this entry holds it. The page route `src/routes/[[slug]].tsx` ([001§3.8](../001-design-v2-modules/SPEC.md#38-home-page)) renders it inside `<main>`, after the page's own modules, and passes it the page's slug, which the component compares with `excludedSlugs`. The suffix modules are therefore part of the page's content: they sit above `<main>`'s bottom padding ([001§3.12](../001-design-v2-modules/SPEC.md#312-shared-components)) and the footer ([002§3](../002-design-v2-header-footer/SPEC.md#3-footer)).

A hero with its rule ([001§3.1](../001-design-v2-modules/SPEC.md#31-hero-centered-alignment-and-rule)) that ends a page sits between two rules, its own and the footer's, and its content is centered between them. The hero's own padding already puts the same space above its content as below it, so what is removed is everything else beneath it: when the last element in `<main>` is such a hero, `<main>` drops its bottom padding and the hero's bottom margin. `HeroModule.tsx` marks the section with `data-rule-above` whenever it draws the rule, and the page route's `<main>` holds both rules, so the hero states a fact about itself and the page decides what follows from it. This applies to any page that ends in a ruled hero, whether the hero is a suffix module or the page's own.

The not-found view renders no suffix modules, neither in the page route's fallback nor in `src/routes/[...404].tsx`.

The entry is read with `createCmsContent` ([000§7.2](../000-initial/SPEC.md#72-primitives)), as the constants and the navigation are, so it follows live preview: with the entry open in the admin, an edit to a module or to the excluded pages shows in the preview as it is made. The collection has no page of its own, so the admin previews whichever page was open last ([000§9.2](../000-initial/SPEC.md#92-preview-component)). When that page is an excluded one the preview shows no suffix modules, which is the list doing its job. The route's `preload` warms the entry beside the page's.

For click-to-edit ([GAC§2](../GLOBAL_ACCEPTANCE_CRITERIA.md)), the modules are a `ContentFor` with `source` set to the entry, so each module's fields resolve to `modules.<index>.<field>` rooted at `universal-suffix-module/main` and not at the page. Clicking a suffix module while editing a page moves the admin to this entry with the field focused, through the cross-collection transition of [000§9.6](../000-initial/SPEC.md#96-click-to-edit-focusing-the-editor-field).

## 4. Initial content

The entry holds one module, the closing banner: a centered hero with its rule ([001§3.1](../001-design-v2-modules/SPEC.md#31-hero-centered-alignment-and-rule)), "Ready to begin?", carrying the Weddings page's copy and its "Request a consultation" link to `/contact`.

That banner is removed from `weddings.md` and `home.md`, which would otherwise show it twice. The home page's own wording of it is dropped for the shared one. About, Flavors, and Gallery, which had no banner, now end with it, and Contact does not ([§2](#2-excluded-pages)).

## Known gaps

- **Clicking the banner's button in the preview leaves the preview on Contact.** A click on a link's label in the preview focuses its field, and the router follows the link as well, which is so for every CTA ([000§8.4](../000-initial/SPEC.md#84-preview-side-behavior)). The banner's link leads to the one excluded page, so the admin arrives at this entry with the right field focused and the preview showing a page that has no suffix modules. The banner's heading and copy are not links, and a click on either keeps the preview where it was.
