# 001 — modules build-out

|            |                                                               |
| ---------- | ------------------------------------------------------------- |
| Status | Implemented |
| Depends on | [000](../000-initial/SPEC.md)                                 |
| Snapshot | 2026-10-07, commit `b70fe48e5231ff2b2c03710e70b3505eb69b12a9` |

## Description

Now that the project has a solid foundation, we're ready to mass produce the rest of the existing modules. This spec records how each section of the "All Pages v2" design maps onto the module system of [000§13](../000-initial/SPEC.md#13-modules): which sections an existing module already renders, which need a change to an existing module, and which need a new module. It also commits to building the designed pages and a home page as real page entries, so that the site is developed against its actual pages instead of `/test-page` ([§3.7](#37-real-pages-replace-the-test-page), [§3.8](#38-home-page)). It was written before any code, so that the mapping was agreed first; the decisions that only came up while building are recorded in the section they belong to. No section of the design is dropped: what changes is in [§3](#3-decided-changes), and what is left to a later feature is in [§4](#4-deferred).

## 1. Source design

The design is the file `Cake Elizabeth All Pages v2.html` in the Claude Design project "Cake Elizabeth" (`https://claude.ai/design/p/7d1db719-b904-41d7-9765-c9131205684b`). It holds five desktop artboards: Contact, About, Weddings, Gallery, and Flavors. There are no mobile artboards. The Contact artboard's form is a working prototype, so its validation rules and messages are taken from the design's script as well as from what it draws.

Mobile layouts are not drawn. They follow from the desktop ones by wrapping: what sits side by side on desktop wraps onto further lines as the width runs out, in document order, so that at mobile width a row of columns becomes a single stack ([000§11.2](../000-initial/SPEC.md#112-responsive-model)). Nothing is hidden, reordered, or restyled for mobile unless its section says so. Where wrapping gives an unexpected or awkward result when a section is built, the case is raised before it ships and its answer is written into that section.

This spec records the engineering decisions the design calls for: which module renders a section, what fields it has, how it is marked up, and how it behaves. It does not carry the design's spacing, sizes, or type values, which are design decisions and are read from the design when a section is built. Where a section has a counterpart that is already built, its spacing follows that implementation (the modules of [000§13.2](../000-initial/SPEC.md#132-modules), the components of [000§12](../000-initial/SPEC.md#12-shared-components), and the base styles of [000§11.4](../000-initial/SPEC.md#114-utilities-and-base-styles)) and not the design's pixel values.

The design's colors are near-matches of the tokens in [000§11.1](../000-initial/SPEC.md#111-tokens). The tokens are authoritative: the design's values are read as the existing tokens, and no token changes to follow the design. The one addition is the contact form's error color, which has no existing counterpart ([§3.9](#39-contact-form-module)).

## 2. Section inventory

| Page     | Section                                                            | Outcome                                                                     |
| -------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Contact  | Page head: eyebrow, headline, lede                                 | Existing hero, no image ([000§13.2](../000-initial/SPEC.md#132-modules))    |
| Contact  | Two-column split with a primary-colored divider                    | Existing grid ([000§13.2](../000-initial/SPEC.md#132-modules))              |
| Contact  | "Request a quote": four-field form and a line of contact details   | New contact form — [§3.9](#39-contact-form-module)                          |
| Contact  | "How to order": four numbered steps, stacked                       | New vertical stepper — [§3.4](#34-vertical-stepper-module)                  |
| About    | Page head                                                          | Existing hero, no image                                                     |
| About    | Two-column split                                                   | Existing grid                                                               |
| About    | "About Elizabeth": three paragraphs, two buttons                   | Existing general ([000§13.2](../000-initial/SPEC.md#132-modules))           |
| About    | Portrait on a primary-colored band above a pull quote              | General, changed — [§3.2](#32-general-untitled-submodule-and-pull-quote)    |
| About    | Fresh / Custom / Local / Yours: four unnumbered columns            | New horizontal list — [§3.3](#33-horizontal-list-module)                    |
| Weddings | Image hero: eyebrow, headline, lede, two buttons                   | Existing hero, with image                                                   |
| Weddings | "The wedding experience": heading and four numbered steps in a row | New horizontal list, enumerated — [§3.3](#33-horizontal-list-module)        |
| Weddings | "Wedding gallery": wedding cakes only, no filter chips             | Gallery, changed — [§3.5](#35-gallery-preset-tag)                           |
| Weddings | "Ready to begin?": centered closing banner under a rule            | Hero, changed — [§3.1](#31-hero-centered-alignment-and-rule)                |
| Gallery  | Heading, filter chips, masonry                                     | Existing gallery ([000§14](../000-initial/SPEC.md#14-gallery-module))       |
| Flavors  | Page head                                                          | Existing hero, no image                                                     |
| Flavors  | Flavor categories, three across, no heading                        | Flavor menu, changed — [§3.6](#36-flavor-menu-optional-heading-and-columns) |
| Flavors  | "Popular combinations": four cards and a button                    | New flavor combinations — [§3.10](#310-flavor-combinations-module)          |
| All      | Header navigation and footer                                       | Not modules; deferred — [§4.1](#41-header-and-footer)                       |

## 3. Decided changes

### 3.1 Hero: centered alignment and rule

The Weddings closing banner is rendered by the hero module, not by a new module. `src/models/modules/HeroModule.shape.ts` gains an `alignment` select with options `left` and `center`, defaulting to `left`, and a `ruleAbove` boolean defaulting to `false`; `eyebrow` becomes optional so the banner can omit it. Both new fields are optional in the schema, and an absent value reads as its default, so an entry written before the fields existed still validates.

With `alignment: center`, `src/modules/HeroModule.tsx` centers the text block and its text, and centers the CTA row, with or without a background image. Over an image, the directional gradients of [000§13.2](../000-initial/SPEC.md#132-modules) would leave centered text on the part of the photo they have faded from, so a centered hero with an image is covered by an even `black/50` scrim in their place. A left-aligned hero keeps its gradient. The banner's heading is authored in `content` as a markdown `h2` ("Ready to begin?"), followed by its line of copy.

The banner's padding and the spacing between its heading, copy, and CTA row are those of today's hero without an image.

With `ruleAbove` on, a primary-colored rule, drawn as the general module's `hr` is ([000§13.2](../000-initial/SPEC.md#132-modules)), spans the content column directly above the hero's content. The rule is an editor's choice and not a consequence of `alignment`, so a centered hero can go without it and a left-aligned one can carry it. It is drawn only when the hero has no background image, where the image already bounds the section. The Weddings banner sets it.

`left` with `ruleAbove` off reproduces today's hero, so existing content is unaffected. The one difference is that the CTA row is now the shared `CtaList` ([§3.12](#312-shared-components)), which is not rendered for a hero with no CTAs.

### 3.2 General: untitled submodule and pull quote

The About page's portrait and quote are rendered by a general submodule, not by a new module. In `src/models/modules/GeneralModule.shape.ts` the submodule `title` becomes optional; `src/modules/GeneralModule.tsx` already renders nothing for an absent field, so an untitled submodule opens with its image strip.

The portrait is the submodule's existing `heroImage`: an image centered on a primary-colored band. The design draws the band taller than the existing strip, and the strip stays as it is. What else changes in the general module is listed at the end of this section; the rest is left as it is ([§5](#5-sections-that-need-no-change)).

The quote is a markdown blockquote in `body`. `src/app.css` gains a base `blockquote` style beside the element defaults of [000§11.4](../000-initial/SPEC.md#114-utilities-and-base-styles): serif and italic, in the heading color. The quotation marks are part of the authored text.

Two further changes to the general module follow from decisions made for every page:

- **CTAs sit in a row.** A submodule's CTAs are the shared `CtaList` ([§3.12](#312-shared-components)): side by side with a gap, as the design draws the two buttons under "About Elizabeth". Before, they were inline buttons that touched each other.
- **The first submodule draws no rule.** The rule above a general module's first submodule existed to separate it, on mobile, from the grid cell stacked above it. The grid now draws that separation for every kind of cell ([§3.7](#37-real-pages-replace-the-test-page)), so the general module draws a rule only between one submodule and the next, and its `<section>` no longer pads its own top when it is not the first cell. With the hidden rule gone from the markup, a first submodule's heading or image is its first element and lines up with the top of the cell beside it.

### 3.3 Horizontal list module

The Weddings page's "The wedding experience" and the About page's Fresh / Custom / Local / Yours row are one new leaf module, `HorizontalListModule` (registry key `horizontalList`). The name describes its desktop layout. Fields: an optional `heading`, `items` each with a `title` and a `description`, and an `enumerate` boolean defaulting to `false`, optional in the schema as the hero's new fields are ([§3.1](#31-hero-centered-alignment-and-rule)).

The items are a real list. With `enumerate` on, the module renders an `ol`; otherwise a `ul`. In both cases the browser's own markers are hidden (`list-none`). With `enumerate` on, the component prints the ordinal itself, derived from the item's position, in a `span` carrying `aria-hidden="true"`: the `ol` already conveys the position to assistive technology, so a second spoken number would be redundant. The list also carries `role="list"`, because WebKit drops list semantics from a list whose markers are hidden, and without them the hidden ordinal would leave screen-reader users with no order at all.

The heading is an `h2`. On desktop the items sit in a row of equal columns, and on mobile they stack. Each item's title is an `h3` drawn as the flavor menu's category headings are ([000§13.2](../000-initial/SPEC.md#132-modules)), with the same primary-colored bottom border and the same space beneath it, above the description. The ordinal, when present, is inline before the title, italic, and followed by a period ("1. Consultation").

### 3.4 Vertical stepper module

The Contact page's "How to order" is a separate new leaf module, `VerticalStepperModule` (registry key `verticalStepper`), not a layout of the horizontal list. Fields: an optional `heading` and `steps` each with a `title` and a `description`.

It is always enumerated and uses the same accessibility treatment as [§3.3](#33-horizontal-list-module): an `ol` with hidden markers and `role="list"`, and a component-printed ordinal in an `aria-hidden="true"` `span`.

The heading is an `h2`. The steps are stacked, and each is a two-column row: a narrow column holding the ordinal, large, serif, italic, and followed by a period, beside the title, an `h3`, with the description beneath it. The description sits close under its title, in place of the default space between a heading and a paragraph, so that a step reads as one unit and the larger space falls between steps.

Both modules are leaves, registered in `src/models/BaseModuleRegistry.shape.ts`, so either can sit inside a grid; the vertical stepper is the right half of the Contact page's split.

### 3.5 Gallery: preset tag

The Weddings page's wedding-only gallery is the gallery module with a preset tag, not a new module. `src/models/modules/GalleryModule.shape.ts` gains an optional `tag`, chosen from the tags in the `tags` collection. `fields.select` in `src/lib/cms/define.ts` gains the `refOptions` option that `multiSelect` already has ([000§6.5](../000-initial/SPEC.md#65-reference-options-resolved-at-generation-time)), so that a single tag can be offered from the collection's current values without a hand-written option list ([GAC§3](../GLOBAL_ACCEPTANCE_CRITERIA.md)). With `refOptions` the field's Zod schema is `z.string()`, because the options are not known to the type system.

When `tag` is set:

- Only items carrying that tag are shown. Ordering, the column cap, and the layout are those of [000§14](../000-initial/SPEC.md#14-gallery-module).
- The filter chips are not rendered.
- The `galleryFilterTag` query parameter is ignored for filtering, so a URL that arrives carrying some other tag cannot empty the gallery.
- Each item's link sets `galleryFilterTag` to the preset tag along with `modal`. The gallery modal takes its previous and next items from that parameter ([000§15.3](../000-initial/SPEC.md#153-shell-and-navigation)) and is mounted once for the whole site, so it has no other way to learn which gallery opened it; passing the tag in the URL keeps stepping inside the preset tag and leaves the modal unchanged. Closing the modal clears only `modal`, which leaves the parameter in the URL, where this gallery ignores it. To build a link that sets two parameters, `getHref` in `src/lib/utils/createQueryParamRouting.ts` ([000§16](../000-initial/SPEC.md#16-shared-utilities)) takes an optional second argument: an href to build on in place of the current location.

With no `tag` the module behaves exactly as it does today.

### 3.6 Flavor menu: optional heading and columns

The Flavors page's categories, three across with no heading, are rendered by the flavor menu module. In `src/models/modules/FlavorMenuModule.shape.ts`, `heading` becomes optional and a `layout` select is added with options `stacked` and `columns`, defaulting to `stacked` and optional in the schema ([§3.1](#31-hero-centered-alignment-and-rule)).

With `columns`, the categories sit in three equal columns on desktop; each category is otherwise drawn as in [000§13.2](../000-initial/SPEC.md#132-modules). On mobile both layouts stack. `stacked` stays the default so that a flavor menu inside a grid, as on the home page ([§3.8](#38-home-page)), is unchanged.

With no `heading`, each category's heading is an `h2` and not an `h3`, so that on the Flavors page the hero's `h1` is followed by `h2`s and the outline skips no level. The element changes and the look does not. `src/app.css` gains a `heading-3` utility holding the type of the `h3` element default ([000§11.4](../000-initial/SPEC.md#114-utilities-and-base-styles)); the `h3` rule applies it, and the promoted `h2` carries it as a class in place of the `h2` default's size and italic, so the two cannot drift apart. The class can override the `h2` default because the element defaults sit in the base layer ([§3.11](#311-element-defaults-mobile-text-sizes-and-links)). With a `heading` the categories stay `h3`s under it.

The categories are spaced by the list's `gap` and not by padding on each one, so a menu with no heading does not open with a category's padding, and the footnote's `<p>` is rendered only when there is a footnote.

### 3.7 Real pages replace the test page

The five designed pages are built as page entries in `public/content/`, served by the `/:slug` route of [000§10](../000-initial/SPEC.md#10-site-shell-and-routes) and edited through the CMS like any other page. From this feature on, modules are developed and reviewed on these pages; `test-page` stops being the place where the site is assembled.

| Entry         | Route       | Modules, in order                                                                                                                                                                                                                                   |
| ------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `contact.md`  | `/contact`  | Hero without image; grid of the contact form ([§3.9](#39-contact-form-module)) and the vertical stepper ([§3.4](#34-vertical-stepper-module))                                                                                                       |
| `about.md`    | `/about`    | Hero without image; grid of a general submodule ("About Elizabeth") and the untitled portrait and quote ([§3.2](#32-general-untitled-submodule-and-pull-quote)); horizontal list, not enumerated ([§3.3](#33-horizontal-list-module))               |
| `weddings.md` | `/weddings` | Hero with image; horizontal list, enumerated, with heading ([§3.3](#33-horizontal-list-module)); gallery with the preset tag `Wedding` ([§3.5](#35-gallery-preset-tag)); centered hero with its rule ([§3.1](#31-hero-centered-alignment-and-rule)) |
| `gallery.md`  | `/gallery`  | Gallery                                                                                                                                                                                                                                             |
| `flavors.md`  | `/flavors`  | Hero without image; flavor menu with no heading, in columns ([§3.6](#36-flavor-menu-optional-heading-and-columns)); flavor combinations ([§3.10](#310-flavor-combinations-module))                                                                  |

Each entry carries the design's copy as its initial content. The slugs are the design's navigation labels in lower case.

The design draws its photos as striped placeholders, so the entries name real files. The About portrait is `/images/aboutus.png`, the image `test-page`'s "About" submodule already uses. The Weddings banner's second button is the phone number as a `tel:` link ([§3.12](#312-shared-components)). The Weddings hero is `/images/homehero.jpg`, which the home page's hero also uses. The two pages share it by decision: every wedding photo in `public/images/` is square and at most 1080 px wide, which is the wrong shape and too small for a hero. Because the design draws no real photo, how each image is cropped is left to the modules as they stand ([000§13.2](../000-initial/SPEC.md#132-modules)) and has no design to be checked against.

`src/routes/about.tsx`, the starter's placeholder, is removed so that `/about` reaches the CMS page instead of being shadowed by the static route. `/contact` and `/gallery`, which existing content and the gallery modal's Inquire button already link to, stop falling through to the not-found view.

These pages put leaf modules at the top level of a page that have so far only been rendered inside a grid. The flavor menu and general modules carry no container of their own, because the grid supplies it. A leaf module at the top level therefore supplies its own `page-container`, `content-container`, and the section spacing the grid uses, and supplies none of them inside a grid. The distinction is made in CSS from the `group/grid-container` marker that `GridModule.tsx` already sets, so a module is not told where it is and the editor has nothing to configure.

`src/app.css` holds the distinction as two utilities, so that every leaf module is written the same way and the selector that detects the grid exists once ([GAC§12](../GLOBAL_ACCEPTANCE_CRITERIA.md)):

| Utility | Goes on | Outside a grid, expands to |
| --- | --- | --- |
| `module-section` | The module's root `<section>` | `page-container` and the section spacing the grid uses |
| `module-content` | The element directly inside it | `content-container` |

Inside a grid both expand to nothing. The flavor menu and the four new modules use the pair. The hero and the gallery keep the containers they already had, and the general module does not use the pair ([Known gaps](#known-gaps)).

On mobile the grid's two cells stack ([§1](#1-source-design)), and the desktop divider between them has no counterpart. `GridModule.tsx` therefore separates the second cell from the first on mobile, whatever modules they hold: the standard step of space, a primary-colored rule, and the step again. This was raised when the Contact page was built. Before, only a general module was separated from the cell above it, by a rule of its own ([§3.2](#32-general-untitled-submodule-and-pull-quote)), so the form and the stepper stacked with nothing between them.

A page is complete only when every module it lists exists.

### 3.8 Home page

The design has no artboard for the home page, and `/` is the starter's "Hello world!" page. `test-page` holds what reads as home page content, so that content becomes the home page. The page as `test-page` already renders it is the accepted design: it was built and reviewed there, so no artboard is drawn for it and none is needed to check it against.

A `home.md` page entry is rendered at `/`. The starter's `src/routes/index.tsx` is removed, and the page route `src/routes/[slug].tsx` becomes `src/routes/[[slug]].tsx`. The doubled brackets make the slug optional, so the one route matches `/` as well as `/:slug`, and it renders the entry with the slug `home` when the URL carries none. Every CMS page, the home page included, is served by that one file. Its initial modules are `test-page`'s, in order, less the duplicated trailing hero: the hero ("Cakes that tell your story"), the grid of the flavor menu beside the "Contact" and "About" submodules, and the gallery.

The entry has one address. `/home` redirects to `/`, and `previewPath` in `src/models/Page.shape.ts` maps the slug `home` to `/`, so the admin previews the page where visitors see it. The slug is a single named constant, `HOME_PAGE_SLUG` in `src/models/Page.shape.ts`, that the route, the redirect, and `previewPath` all reference.

The redirect is the router's own: the route renders `<Navigate>` in place of the page when the URL's slug is `HOME_PAGE_SLUG`. That covers a request to the server and a link followed inside the running app alike, and it keeps the query string. The router's server-side navigation always answers 302, so the redirect is temporary and not permanent. A 301 would need the status set outside the router, by a middleware or by the route writing the response itself, and for an address that nothing links to, that is not worth a second mechanism.

`public/content/test-page.md` and its generated JSON are deleted once the content has moved, so that no public route exists only for development.

### 3.9 Contact form module

The Contact page's "Request a quote" is a new leaf module, `ContactFormModule` (registry key `contactForm`), in a `src/modules/ContactFormModule/` directory. It is the left half of the Contact page's split, where the earlier design had a general submodule of contact details. The phone number and email address now appear only in the line under the form, and the Location line is gone from the page.

The form's inputs are fixed: name, email, phone, and description. An editor changes the form's copy but cannot add, remove, or reorder inputs, so the submitted data always has the same four keys. Every string the form shows is a field on the module and not in the `constants` collection, so each is edited where it appears ([GAC§1](../GLOBAL_ACCEPTANCE_CRITERIA.md)). The four inputs are `fields.object`s named after their keys.

| Field         | Holds                                                   | Initial content                                                                                                                                                                                                                                                                    |
| ------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `heading`     | Optional `h2` above the form                            | "Request a quote"                                                                                                                                                                                                                                                                  |
| `name`        | `label`, `requiredError`                                | "Name"; "Please tell us your name."                                                                                                                                                                                                                                                |
| `email`       | `label`, `requiredError`, `invalidError`                | "Email"; "We need an email to reply to."; "That email doesn’t look quite right."                                                                                                                                                                                                   |
| `phone`       | `label`, `optionalLabel`, `placeholder`, `invalidError` | "Phone"; "(optional)"; "207 555-0123"; "Please enter a 10-digit phone number."                                                                                                                                                                                                     |
| `description` | `label`, `placeholder`, `hint`, `requiredError`         | "Tell us about your cake"; "e.g. A two-tier birthday cake for June 14th, about 40 guests. Blush and gold, lemon if possible — open to ideas!"; "Date, servings, theme and flavors help us quote faster — but rough ideas are perfectly fine."; "Tell us a little about your cake." |
| `submitLabel` | The submit button's text                                | "Send request"                                                                                                                                                                                                                                                                     |
| `footnote`    | Optional markdown under the form                        | "Prefer to talk? Call 207 370-4008 or email us directly info@cakeelizabeth.com with images of your ideas!", the number a `tel:` link and the address a `mailto:` link                                                                                                              |

For click-to-edit ([GAC§2](../GLOBAL_ACCEPTANCE_CRITERIA.md)), each `label` element carries its label field. A placeholder is an attribute with no element of its own, so the input carries the placeholder field through `useCmsFieldProps`. An error message carries its own field and can be clicked while it is shown. The four input objects are the first object widgets nested inside a module, and Decap shows them collapsed; how a click opens them is in [§3.13](#313-click-to-edit-navigation-in-the-admin). The preview does not show the messages at any other time, and that is deliberate: it shows the form as a visitor sees it, the criterion covers values that are rendered, and an editor reaches a message by triggering it or through the module's fields in the editor.

**Markup.** The form is a `form` with `novalidate`, so the browser's own validation bubbles do not compete with the inline messages. Each input has a `label` tied to it with `for`. The inputs are `name` (`type="text"`, `autocomplete="name"`), `email` (`type="email"`, `autocomplete="email"`), `phone` (`type="tel"`, `autocomplete="tel"`), and `description` (a `textarea` of 7 rows); each one's `name` attribute is its key. The three required inputs carry `required`, which `novalidate` keeps from blocking the submit while it still tells assistive technology the input is required. An input showing an error carries `aria-invalid="true"` and an `aria-describedby` pointing at its message; the description's `aria-describedby` points at its hint when it has no error.

**Validation.** The rules run on the trimmed values each time an input changes:

- `name` is required.
- `email` is required, and must match `^[^\s@]+@[^\s@]+\.[^\s@]{2,}$`.
- `phone` is optional. When it is not empty, its digits, with every other character ignored, must number 10, or 11 with a leading 1.
- `description` is required.

The phone rule accepts US numbers only, and that is deliberate. The studio takes its orders in Maine, and the input is optional: a visitor whose number is from elsewhere leaves it empty and is answered at the email address the form requires.

An input's error is shown only once the input has been touched: when it loses focus, or when a submit is attempted, which touches all four. Because the rules run on every change, an error disappears as soon as the value becomes valid, without waiting for another blur. The description's error takes the place of its hint.

**Submission.** The submit handler prevents the default submission and touches every input. If any rule fails, focus moves to the first invalid input in document order; the design leaves focus on the button, and this is added so that keyboard and screen-reader users land on what needs fixing. If every rule passes, the handler calls `alert(JSON.stringify(formData, null, 2))`, where `formData` is an object with the keys `name`, `email`, `phone`, and `description` holding the values as typed. Nothing is sent anywhere, and the form keeps its values afterwards. Where a request goes, and the design's sent state, are deferred ([§4.2](#42-contact-form-submission-and-sent-state)).

The values are held in component state and never written to the URL: they are personal details, not state a visitor would share or return to ([GAC§7](../GLOBAL_ACCEPTANCE_CRITERIA.md)).

**Layout.** The form is a two-column grid. Name and email share the first row; phone, description, and the submit button each span both columns. On mobile every input spans the full width.

- **Labels** sit above their input, in uppercase. The phone's `optionalLabel` follows its label in normal case.
- **Inputs** use the body text size and a `--color-border` border. That size is 16 px at both widths ([§3.11](#311-element-defaults-mobile-text-sizes-and-links)); iOS Safari zooms the page when an input with smaller text takes focus. The textarea resizes vertically only.
- **Focus** turns the border primary and adds a ring in the primary color.
- **Errors** turn the border the error color. The message sits under the input in the error color, and the description's hint sits in the same place.
- **The submit button** is a `button` with `type="submit"`, drawn as the `primary` variant of `LinkButton` ([000§12](../000-initial/SPEC.md#12-shared-components)). `src/components/LinkButton.tsx` exports that variant's class for it, as it already exports `iconLinkButtonClass`.
- **The footnote** sits under the form.

`@theme` in `src/app.css` gains one token, `--color-error` `#b23a2e`, the design's error text color. It is used for both the message and the invalid border; the design's lighter border red is not carried over. The design's two greys for labels, hints, and "(optional)" are both read as `--color-secondary-foreground`.

### 3.10 Flavor combinations module

The Flavors page's "Popular combinations" is a new leaf module, `FlavorCombinationsModule` (registry key `flavorCombinations`). An earlier revision of this spec dropped the section and expected it to leave the design; the baker has since decided it is worth having, so it is built as the design draws it: four cards, each a name above Cake, Filling, and Frosting rows, with an "Ask about flavors" button beneath them.

Fields: an optional `heading`; `cakeLabel`, `fillingLabel`, and `frostingLabel`, the three row labels; `combinations`, each with a `name`, a `cake`, a `filling`, and a `frosting`; and an optional `ctaList` of links, as the hero and general modules have ([000§13.2](../000-initial/SPEC.md#132-modules)).

The combinations belong to the module and not to a collection: they are shown in this one place, and an editor changes them where they appear. The row labels are fields on the module and not in the `constants` collection for the same reason ([GAC§1](../GLOBAL_ACCEPTANCE_CRITERIA.md)); they are held once on the module and not on each combination, so the three labels cannot differ from card to card. A combination's `cake`, `filling`, and `frosting` are free text and not references into the `flavor-categories` collection, so a combination can name something the flavor menu does not list, or describe it more loosely than a menu entry would. The three are optional, so a combination can leave a row out.

**Markup.** The heading is an `h2`. The cards are a `ul` with hidden markers and `role="list"`, for the reason given in [§3.3](#33-horizontal-list-module). Each card's name is an `h3`, and its rows are a `dl` in which each label is a `dt` and each value a `dd`. A row whose value is absent is not rendered, and neither is its label. For click-to-edit ([GAC§2](../GLOBAL_ACCEPTANCE_CRITERIA.md)), every `dt` carries its label field, so clicking a label on any card focuses the same module field.

**Layout.** On desktop the cards sit in one row of four equal columns. On mobile they stack. The cards in a row share their row tracks through CSS subgrid: the name is one track and each of Cake, Filling, and Frosting is another, so every track is as tall as its tallest cell in that row of cards. A name or a value that wraps in one card therefore moves the same part of every card, and the names' rules and the three rows line up across the cards. Each row is placed on its own track by position and not by order of appearance, so a card that leaves a row out keeps the rows it has in line with the others. A name is centered in its track, across and down, so one shorter than the tallest sits midway above its rule. On mobile, where the cards stack and have nothing beside them to line up with, a card is an ordinary block. The CTA row sits beneath the cards and is drawn as the hero's is ([000§13.2](../000-initial/SPEC.md#132-modules)); a CTA renders only when both its `url` and `label` exist. The Flavors page's one CTA is "Ask about flavors", linking to `/contact`.

### 3.11 Element defaults, mobile text sizes, and links

Three changes to `src/app.css` and the shared components reach every page. They were decided while the modules above were built.

**Element defaults sit in the base layer.** The `h1`–`h3`, `p`, `blockquote`, `a`, and `button` defaults of [000§11.4](../000-initial/SPEC.md#114-utilities-and-base-styles) were written outside any cascade layer, where they beat every utility class whatever its specificity: a class on a heading or a paragraph could not change its size, color, font, or top margin. They now sit in `@layer base`, so a utility on an element overrides that element's default. This is what lets `heading-3` ([§3.6](#36-flavor-menu-optional-heading-and-columns)) be an ordinary utility. One existing class started to apply as a result, the `text-sm` on the gallery modal's description ([000§15.6](../000-initial/SPEC.md#156-content-panel)); it is removed, so the description keeps the paragraph default it had always shown.

**Small text is a step larger on mobile.** On mobile, every text size that was below 16 px goes up one step of Tailwind's scale. Desktop sizes are unchanged, and so is everything that was already 20 px or more on mobile: the headings and the pull quote. Against the sizes of [000§11.4](../000-initial/SPEC.md#114-utilities-and-base-styles), [000§12](../000-initial/SPEC.md#12-shared-components), and [000§14.3](../000-initial/SPEC.md#143-filtering):

| Text | Desktop | Mobile |
| --- | --- | --- |
| The `p` default | `text-base` | `text-base`, was `text-sm` |
| `LinkButton`'s text variants, `ListItemChip`, gallery filter chips | `text-sm` | `text-base`, was `text-sm` |
| `Eyebrow` | `text-sm` | `text-sm`, was `text-xs` |
| Contact form inputs | `text-base` | `text-base` |
| Contact form hints and errors, combination card values | `text-sm` | `text-base` |
| Contact form labels, combination card row labels | `text-xs` | `text-sm` |

**Links in markdown are underlined.** `Content` gives the element it renders markdown into the `markdown-content` utility, which underlines the links inside it in the primary color. Before, a link written in markdown could not be told from the text around it. The utility is scoped to markdown output so that buttons and chips, which are anchors too, are unaffected.

### 3.12 Shared components

- **`CtaList`** (`src/components/CtaList.tsx`) is the hero's CTA row, extracted so that the hero, the general module ([§3.2](#32-general-untitled-submodule-and-pull-quote)), and flavor combinations ([§3.10](#310-flavor-combinations-module)) share one ([GAC§12](../GLOBAL_ACCEPTANCE_CRITERIA.md)). It takes the object that holds a `ctaList` field and renders the links as a row with a gap. A CTA renders only when both its `url` and `label` exist, and the row is not rendered at all for an empty list, where the hero used to leave an empty row and its margin.
- **`LinkButton`** renders a plain `<a>` when its `href` starts with a URL scheme (`tel:`, `mailto:`, `https:`) and the router's `<A>` otherwise. The router resolves every `href` as a path, which turned `tel:2073704008` into `/weddings/tel:2073704008`; the Weddings banner's phone button is the first CTA that is not a page of the site.
- **Page bottom space.** The page route of [§3.8](#38-home-page) gives `<main>` the standard step of bottom padding, so that a page does not end flush against its last module while there is no footer ([§4.1](#41-header-and-footer)).

### 3.13 Click-to-edit navigation in the admin

The pages of this spec reach two cases that made `navigateToField` in `admin/navigateToField.ts` ([000§9.6](../000-initial/SPEC.md#96-click-to-edit-focusing-the-editor-field)) stop short of the field, so that a click in the preview opened only the outer levels of the editor. Both are fixed, and the walk reaches a field at any depth.

- **Collapsed object widgets.** The contact form's four inputs ([§3.9](#39-contact-form-module)) are the first object widgets nested inside a module, and Decap shows them collapsed. On an intermediate named segment whose control is a collapsed object, the walk now clicks its toggle and waits for it to open before descending, as it already did for collapsed list items. A collapsed object is recognized by its fields, the element after its top bar, being `display: none`. A list control never matches, because the element after its top bar holds its items, which stay displayed.
- **Lists with one item.** A numeric segment used to find a list's items by their labels: it took the first label inside the list and climbed until a parent had several children sharing that first label, with a fixed two-level fallback when none did. A list holding a single item of plain fields has neither such siblings nor a label of its own, so the fallback landed on a field inside the item, and nothing below it was opened. Every general module on the About page is this case, because its `submodules` list has one entry ([§3.7](#37-real-pages-replace-the-test-page)). The items are now read from the list control's structure instead: a top bar followed by a wrapper that holds one element per item. The wrapper also holds the two helper elements of Decap's drag-and-drop library, which are told apart from items by containing no button.

## 4. Deferred

These parts of the design are left to a later feature. Nothing is built for them here.

### 4.1 Header and footer

The design has a header (site name and five navigation links, the active one underlined in the primary color) and a footer (site name, phone and email, copyright line, under a primary-colored rule). They are site shell, not modules, and need CMS-backed content for the links and footer text. They are not built in this feature and no spec for them exists yet. The shell stays as [000§10](../000-initial/SPEC.md#10-site-shell-and-routes) describes it, with its two literal placeholder links, and the pages of [§3.7](#37-real-pages-replace-the-test-page) are reached by URL in the meantime.

### 4.2 Contact form submission and sent state

The contact form of [§3.9](#39-contact-form-module) validates its inputs and then only shows them in an `alert`. Where a request is sent (an email, a form service, an endpoint of the site's own) is not decided, and nothing is built for it.

The design's sent state waits on the same decision, because there is nothing to confirm until a request is really sent. In the design a successful submit replaces the form with a panel bordered in the primary color: "Thank you," and the visitor's first name, a line promising a reply to their email address within 48 hours, and a "Send another" button that clears the form and shows it again. No fields are added for that copy yet.

## 5. Sections that need no change

The page heads, the image hero, the two-column split, the "About Elizabeth" copy, and the Gallery page are rendered by the modules of 000 as they stand. Their dimensions are in [000§13.2](../000-initial/SPEC.md#132-modules) and [000§14](../000-initial/SPEC.md#14-gallery-module); where those differ slightly from the design's pixel values, 000's values stand.

Apart from the changes of [§3.2](#32-general-untitled-submodule-and-pull-quote), the general module is deliberately left as it is, which leaves one difference from the design:

- **The image band keeps its height.** The design's portrait band is taller; the strip keeps `max-h-32`.

## Known gaps

- **No navigation between the pages.** With the header and footer deferred ([§4.1](#41-header-and-footer)), the placeholder "Index" and "About" links sit above every real page, and Contact, Weddings, Gallery, and Flavors are reachable only by URL or from links in page content.
- **A general module has no top-level layout.** It does not use `module-section` and `module-content` ([§3.7](#37-real-pages-replace-the-test-page)), so a general module placed at the top level of a page, outside a grid, has no container and no section spacing. No page does this.
- **The contact form sends nothing.** A valid submit shows the visitor's data in an `alert` and leaves the form as it was ([§3.9](#39-contact-form-module)). Until [§4.2](#42-contact-form-submission-and-sent-state) is built, a visitor who submits the form has not contacted anyone.
