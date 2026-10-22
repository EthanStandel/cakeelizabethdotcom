# 002 — header & footer

|            |                                                                        |
| ---------- | ---------------------------------------------------------------------- |
| Status | Implemented |
| Depends on | [000](../000-initial/SPEC.md), [001](../001-design-v2-modules/SPEC.md) |
| Snapshot | 2026-10-12, commit `213aaecd9ef4f8ec00e347f9dc0f1d694b9d37ba` |

## Description

This spec defines the creation of the header & footer. We will be using the "All Pages v2" design from [001](../001-design-v2-modules/SPEC.md). They are drawn once around every page, in place of the two literal placeholder links of [000§10](../000-initial/SPEC.md#10-site-shell-and-routes), and they give the pages of [001§3.7](../001-design-v2-modules/SPEC.md#37-real-pages-replace-the-test-page) their navigation.

## 1. Source design

The design is the file `Cake Elizabeth All Pages v2.html` in the Claude Design project "Cake Elizabeth" (`https://claude.ai/design/p/7d1db719-b904-41d7-9765-c9131205684b`).

## 2. Header

The header holds the logo and five navigation links.

It is `Header` in `src/components/Header/`, and `src/app.tsx` renders it above the matched route with the footer ([§3](#3-footer)) below. The header, the route, and the footer each sit in a `<Suspense>` of their own: the constants and the navigation are fetched above all three, and a boundary is what makes the server wait for them before it renders what reads them.

### 2.1 Logo

The logo is an image, and not the site name set as text as the designs show. Constants ([000§7.3](../000-initial/SPEC.md#73-constants)) gain a `logo` image field, set to `/images/logo.svg`, so that the file is chosen in the CMS like any other image ([GAC§1](../GLOBAL_ACCEPTANCE_CRITERIA.md)). Wherever the logo is shown, its `alt` is the constant value `siteName`, "Cake Elizabeth".

The home page does not need a link alongside the others, but clicking on the logo should navigate to the home page. The logo should not get the highlight.

The logo is one component, `Logo` in `src/components/Logo.tsx`, used by the header and the footer. Its link targets `HOME_PAGE_PATH`, a constant added beside `HOME_PAGE_SLUG` in `src/models/Page.shape.ts` that `previewPath` and the `/home` redirect of [001§3.8](../001-design-v2-modules/SPEC.md#38-home-page) now reference as well.

### 2.2 Navigation model

The data for the header should live in a separate singleton model similar & adjacent to how the constants are modeled ([000§7.3](../000-initial/SPEC.md#73-constants)). The model should be called `Navigation`. The `Navigation` will hold the following properties:

- `links`: a list in which each is of the shape `Link.shape.ts` ([000§6.6](../000-initial/SPEC.md#66-collections)). The `variant` has no meaning for a navigation link and will just be ignored. Like the constants, the entry is provided to the whole app and follows live preview, so an edit to a link shows in the preview as it is made.
- `menuOpen`: An accessibility label for the icon that represents the closed but to-be-opened state of the menu. The default value should be `"Open navigation"`.
- `menuClose`: An accessibility label for the icon that represents the open but to-be-closed state of the menu. The default value should be `"Close navigation"`.

The collection is `navigation` in `src/models/Navigation.shape.ts`, with its one entry at `public/content/navigation/main.md`. `links` is built as the CTA lists are, a list whose single variant is `link`, so a stored link carries the `variant` it ignores. `src/primitives/NavigationContext.tsx` provides the entry as `ConstantsContext.tsx` provides the constants: `NavigationProvider` wraps the app inside `ConstantsProvider`, and `useNavigation()` reads it.

A second entry that follows live preview exposed a fault in the `cms-preview-update` message of [000§8.5](../000-initial/SPEC.md#85-message-protocol). The message named only a slug, every singleton's entry is `main`, and every root field is optional ([000§6.3](../000-initial/SPEC.md#63-everything-is-optional-at-the-collection-root)), so a draft of one singleton parsed as an empty draft of every other: editing the constants would have emptied the header's links, and editing the navigation would have emptied the logo and the footer. The message's payload gains `collection` ([GAC§11](../GLOBAL_ACCEPTANCE_CRITERIA.md)). The admin's preview template is built with its collection's name and sends it, and `createCmsLiveContent` ignores a message for any other collection.

### 2.3 Current page

The link to the current page should be underlined in the primary color. The underline should animate in from left-to-right and out from left-to-right as well, so that it leaves by the end it arrived at last.

The current page is decided by the URL's path alone: the link whose `url` equals the path is the current one, and it carries `aria-current="page"`. The query string is not compared, so a page's link stays current while the gallery modal is open over it ([000§15.1](../000-initial/SPEC.md#151-routing)). On the home page and on the not-found page no link is current.

The underline animates the state change whenever a link in the header represents the current page or whenever the a link in the header is being hovered. This also means that the underline should animate on initial page-loads as well as during client-navigation.

The underline is the `link-underline` utility in `src/app.css`: a rule drawn by the link's `::after`, scaled between nothing and its full width. The edge it scales from changes with its state: the left edge while the link is current or hovered, so it grows rightwards from there, and the right edge otherwise, so it shrinks rightwards into it. The edge is not transitioned, so it switches at the moment the state does and each animation runs from the right side. It is keyed on `:hover` and on `aria-current="page"`, so the attribute is the only thing the component sets. On the first render of a current link there is no earlier state to animate from, so the utility gives that state a `@starting-style` of nothing, which is what makes the underline draw itself on a page load. A browser without `@starting-style` shows the underline at once.

A navigation link is a plain anchor, which the router follows without a reload as it does any anchor of the site, and not the router's `A`. `A` sets `aria-current` by a rule of its own that ignores case, which would mark a link current on a not-found page whose path differs from the link's only by case. `NavigationLinks` sets the attribute itself, comparing the path with the link's `url` after dropping a trailing slash from each.

### 2.4 Mobile menu

On mobile the links sit behind a menu button, which is the icon alone with no button drawn around it. Opening the menu should feel like the sticky header resizing to take over the whole screen: the header grows downwards until it covers the window, and nothing slides in over it. There is one header throughout. Its logo stays where it is, and its menu icon turns into the close icon, in step with the growth. As the header grows, the links appear one by one, 100 ms apart, the first of them starting with the growth. Within the mobile menu, the content should have the exact same behavior with the only difference being the vertical layout.

The open menu covers the whole screen in the header's own faded, blurred background ([§2.5](#25-position)), so the page shows through it as it does through the header. It closes when the close icon is clicked, when Escape is pressed, when the logo is clicked, or when one of its links is clicked (even if that link leads to the current page). Escape is there for a visitor using a keyboard at mobile width. On closing, the header starts to shrink back at once, and at the same moment the links start to fade out one by one from the last to the first.

Whether the menu is open is held in memory and not in a query parameter ([GAC§7](../GLOBAL_ACCEPTANCE_CRITERIA.md)), so it does not go through the `modal` parameter of [000§15.1](../000-initial/SPEC.md#151-routing).

The menu is part of the header, and not a `<dialog>` laid over it. A modal dialog makes everything outside itself inert, the header included, so a menu built on one has to draw a header of its own in the top layer. That second copy, sliding in over the first, is what this design removes. The header holds one `NavigationLinks` for both widths: a row beside the logo on desktop, and on mobile a column placed below the header's row, which is not displayed while the menu is closed.

The header's background is an element of its own behind the row, `HeaderBackground` in `HeaderBackground.tsx`, and not a background on the `<header>`. It is as tall as the header and, while the menu is open, as tall as the window, and its height is transitioned, which is the growth. The growth takes the `--menu-transition-duration` token in `src/app.css`, 500 ms, with the default easing. It is a token of its own because a surface that crosses the whole window needs longer than the default transition, which this feature shortens to 250 ms for everything else: `--default-transition-duration` in `src/app.css` and its mirror `GALLERY_DURATION_MS` ([000§16](../000-initial/SPEC.md#16-shared-utilities)) both change. One element draws the background of the header and of the menu, so there is no seam where two blurred surfaces would meet. It is a separate element because the `<header>` cannot grow itself: a sticky box taller than its track ([§2.5](#25-position)) is no longer held at the top of the window. The links' column is transitioned to the height that is left below the row, over the same time, and it clips what overflows it, so its lower edge travels with the background's and no link is drawn outside the background.

The background's lower edge is feathered while it moves, so that the growth has no hard line at its front. Its white tint is masked by a gradient that fades out over the element's last `--header-feather`, a length registered with `@property` in `src/app.css` so that it can be transitioned. Its initial value is 16 px, so the header at rest already ends in a short fade over the last of its own height and not in a line, and it grows from there to the `--spacing-header-feather` token as the menu opens. The resting value is written in the `@property` rule itself, because an initial value there cannot refer to a token. The open background is taller than the window by that same token, so the feather ends up below the window and the whole screen is covered. The fully opaque part of the background therefore ends where the links' column does, and the feather runs ahead of it. A browser without `@property` shows the edge unfeathered.

The blur is feathered apart from the tint, because a mask cannot make a blur weaker. Masking a blurred layer only fades it against the sharp page behind it, and half of a full blur over half of a sharp image shows the page's edges through the haze right up to where the blur stops. So the blur steps down across the feather instead. The full blur, `backdrop-blur-md`, covers the opaque part and fades out over the feather's first quarter, and under it lie three weaker layers, `backdrop-blur-sm`, `backdrop-blur-xs`, and a 2 px blur, each reaching a quarter further down than the one before and fading out over its last quarter. Between any two neighbouring strengths the fade is slight, so the blur reads as running down to nothing at the feather's end, where the tint ends too. The three weaker layers are only as tall as the feather, so at rest they are thin strips, and in an open menu they lie below the window with the rest of the feather. The tint and the blurs are layers inside `HeaderBackground`, and `--header-feather` is registered as inherited so that they all read the one transitioned length from it.

Each link waits 100 ms for each link before it and then fades in, so the first starts at the moment the growth does and not after it. The step is the `--navigation-link-stagger` token in `src/app.css`, and `NavigationLinks` gives each link its position in the list, from which the delay is computed in CSS. The fade is slower and more evenly eased than the default transition, the `--navigation-link-fade` token and `ease-in-out`, so that a link arrives softly where the default would have it nearly opaque within its first third. With the fade a link moves a short way: it enters from `-translate-y-3` above its place and settles down into it, and it leaves upwards to the same offset, so the links move the way the header does, down to open and up to close.

A closing menu reverses the order of the links and nothing else. Each link waits the step for each link after it, so the last fades out first; that delay depends on how many links there are, so `Header` gives the header that count and the delay is computed from it in CSS. The background and the column do not wait for the links: they shrink at once, as they grew at once, so the menu is gone in the time of the shrink and the page is not kept covered. The shrinking column clips the links on its way up, the last of them first, so most of each fade is never seen, and that is accepted.

What a dialog would supply is written by hand. The open state is a signal in the shell, `src/app.tsx`, which marks the route and the footer `inert` while the menu is open, so that focus and assistive technology stay within the header. `Header` listens for Escape on the window and locks the page's scroll, as the gallery modal locks it ([000§15.3](../000-initial/SPEC.md#153-shell-and-navigation)), for as long as the menu is open. Focus does not move: the button that opens the menu is the button that closes it. That button is `MenuToggleButton` in `MenuToggleButton.tsx`. It carries `aria-expanded` and `aria-controls`, and it reads its accessible name from the navigation itself, `menuOpen` or `menuClose` ([§2.2](#22-navigation-model)) by state, so `Header` passes it no strings. Its icon is one inline SVG of three lines, hidden from assistive technology, and not two icons swapped: on opening, the outer lines move to the middle and turn across each other into the cross while the middle line fades out, and closing undoes it. The lines move over `--menu-transition-duration` with the default easing, which is the time and easing of the header's growth, so the icon and the header move as one. The distance the outer lines travel is given in pixels and not in the spacing scale, because inside an SVG a length is in the drawing's own units and one that followed the root font size would miss the middle for a visitor who has changed it. Opening the menu also pops the header out ([§2.5](#25-position)), so that the growth starts from the top of the window.

The menu button and the links are both in the server markup, and the button is hidden at desktop width in CSS ([GAC§6](../GLOBAL_ACCEPTANCE_CRITERIA.md)). A menu left open would still hold the page inert at desktop width, where there is no button to close it, so the menu closes when the viewport reaches desktop width.

A closed menu is not displayed, so the column's growth and each link's fade start from a `@starting-style`, and on closing a discrete transition of `display` holds the column on screen until the header has shrunk. The current link's underline ([§2.3](#23-current-page)) replays on that first render as well, and it does not wait for its link's delay: it draws while one of the first links fades in, and it has finished before one of the last begins, which fades in already underlined.

### 2.5 Position

The header should act regular sticky on desktop and _partially_ sticky on mobile, with a blurred background that is faded to be lighter (so that there is always proper legible contrast between the text the background).

The regular sticky header stays at the top of the window however the page is scrolled, as `position: sticky; top: 0;`.

The partially sticky header should always naturally scroll out of frame when scrolling down, but should actually lock as if it were `position: sticky; top: -100%;` (where the `100%` represents the height of the header itself). When scrolling up, it should immediately start naturally scrolling back into frame as if it was just out of frame but then stick as if it was `position: sticky; top: 0;`.

If the user stops scrolling for 500ms when the header is part-way between states, it should behave as follows.

If it is >=50% revealed, it should fully pop out.

Otherwise, if it is <50% revealed, it should fully hide itself.

The `debounce` function from Lodash should be used to manage the polling for this behavior.

The header's position is computed by the browser and not written by a scroll handler, so it never trails the scroll by a frame. The header is `position: sticky; top: 0` inside a track: an absolutely positioned box that starts at the top of the page and ends one header-height below an _anchor_, a document offset held in `createPartiallyStickyHeader.ts`. A sticky box cannot leave its container, so the header sits at the top of the window while the scroll position is above the anchor and is carried out of frame by the track's end once it is past it. The scroll handler only keeps the anchor within one header-height above the scroll position, which moves the track's end while the header is fully hidden or fully shown and so changes nothing on screen until the direction of the scroll reverses.

The track is laid over the page and takes no clicks; a spacer of the header's height holds its place in the flow. That height is one token, `--spacing-header`, which the header, its background, the spacer, the track, and the menu's column ([§2.4](#24-mobile-menu)) all reference; the handler reads the height from the element.

Settling moves the anchor to the scroll position or to one header-height above it, and the track's height is transitioned for that move only. A scroll that arrives during the transition takes the anchor from where the track has got to, so the header carries on from where it is.

On desktop the track is as tall as the page and does not follow the anchor, so its end never reaches the header and what is left is the header's own `position: sticky; top: 0`. The width decides that in CSS, so the server markup and a page without JavaScript are sticky on desktop as well. `Header` tells `createPartiallyStickyHeader` whether the header is partially sticky, from `createBreakpoint` ([000§11.2](../000-initial/SPEC.md#112-responsive-model)), and while it is not, the scroll handler, the settling, and the pop-out do nothing. When the viewport comes back to mobile width the anchor is brought within reach of the scroll position again, as it is on any scroll.

Two additions cover what the scroll alone does not. When focus enters the header while it is hidden, as it does for a visitor tabbing back to it, the header pops out, so that the focused link is not out of frame. Without JavaScript the anchor stays at the top of the page, so on mobile the header scrolls away with the page and does not return.

## 3. Footer

The footer holds the logo, the phone number and email address, and a copyright line, under a primary-colored rule. All the content should live in the constants ([000§7.3](../000-initial/SPEC.md#73-constants)).

The logo is the header's ([§2.1](#21-logo)): the same image, `alt`, and link to the home page. Constants gain `phone`, `email`, and `copyright`. The phone number is a `tel:` link and the email address a `mailto:` link.

The copyright line is authored whole, year included. The year is not computed, so it changes only when an editor changes it.

The footer should always be at the bottom of the window, even if the content isn't taking the full available height.

`<main>` keeps the bottom padding of [001§3.12](../001-design-v2-modules/SPEC.md#312-shared-components). The space between a page's last module and the footer belongs to the content, so the footer adds no top padding of its own.

The footer is `Footer` in `src/components/Footer.tsx`. The shell in `src/app.tsx` is a column at least as tall as the window in which the route takes the spare height, which is what holds the footer at the bottom of a short page. The phone link's `tel:` target is the `phone` constant with everything but its digits removed, so the number is authored once, as it is shown. The phone and email links do not animate: they are always underlined, as a link in markdown is ([001§3.11](../001-design-v2-modules/SPEC.md#311-element-defaults-mobile-text-sizes-and-links)). `src/app.css` gains an `underlined-link` utility holding that underline, which `markdown-content` now applies and the footer's links carry, so the two cannot drift apart. On mobile the footer's three parts stack, centered.

The footer's text is smaller than body text and is all in `text-secondary-foreground`: the links are `text-sm` and the copyright line `text-xs`. It is exempt from the mobile step of [001§3.11](../001-design-v2-modules/SPEC.md#311-element-defaults-mobile-text-sizes-and-links) and keeps those sizes at every width. The footer is not a page's primary content, and the step would have brought its links up to the size of the body text above them.

## Known gaps

- **The header assumes a white page.** Its faded background, which the open menu shares, is white, and the page sets no background of its own, so it matches only while the browser's default canvas is white.
