# 007 — search engine optimization

|            |                                                                                                                                                                                                       |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status | Implemented |
| Depends on | [000](../000-initial/SPEC.md), [001](../001-design-v2-modules/SPEC.md), [002](../002-design-v2-header-footer/SPEC.md), [005](../005-contact-form-email/SPEC.md), [006](../006-not-found-page/SPEC.md) |
| Snapshot | 2026-10-21, commit `41fba93581255d2d1cf280b3cbcd882a5215bc44` |

## Description

This rewrite is from the ground up and is just now getting to core SEO requirements. This spec describes the plan for handling the missing SEO. This means obvious things like `robots.txt` & `sitemap.xml` file generation. This will also includes things like redirects for pages that will no longer exist after the rewrite and things discovered after looking at the SEO code in the current (to-be legacy) site.

## 1. Source behavior

The previous site is the Next.js application on the `main` branch ([000§1](../000-initial/SPEC.md#1-purpose-and-shape-of-the-project)), and the live site is built from it. Its search setup is recorded here because this spec carries it over or replaces it.

| Previous site                                                                                                            | Here                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Each page's `metadata` field held a title and a description; the title was composed as "Title \| Cake Elizabeth"         | The page's `seo` object, and a title template in the constants ([§3.1](#31-content-fields))                                  |
| The layout set `alternates.canonical` to `/`, which every page that did not set its own inherited                        | A canonical address on every page, built from the page's own path ([§3.3](#33-canonical-address))                            |
| `metadataBase` fixed at `https://cakeelizabeth.com`                                                                      | `SITE_URL` from the environment ([§2](#2-site-origin))                                                                       |
| `next-sitemap` wrote `sitemap.xml` and `robots.txt` at build time                                                        | Both served by routes and drawn from the content ([§4](#4-crawling-and-indexing))                                            |
| Only `openGraph.locale`; no image, title, or description for a shared link                                               | A full social card per page, and per gallery item when a modal address is shared ([§3.4](#34-social-card))                   |
| No structured data                                                                                                       | A `Bakery` description of the business on the home page ([§3.5](#35-structured-data))                                        |
| Redirects in `next.config.js`, among them a set carried over from a site before it (`/cake-pricing`, `/cake-flavors`, …) | One redirect table, applied by the server, with every chain flattened to a single hop ([§5](#5-redirects))                   |
| Product pages at `/product/:product`, and images served from TinaCMS's CDN at `assets.tina.io`                           | Product pages redirected to the gallery ([§5.4](#54-redirect-table)); images not redirected ([§5.5](#55-left-to-answer-404)) |
| `/favicon.png` and a `themeColor`                                                                                        | `/favicon.ico`, checked against what a search result needs ([§6](#6-page-experience))                                        |

The canonical inherited from the layout is the reason this spec does not take the previous site's head over as it was. Every live page sets its own, as [§7](#8-tasks) T1 found, but a page added without one would have told search engines it was a copy of the home page.

The Next.js site is the last of four. [§7](#8-tasks) T2 found three before it, whose addresses still have archived captures and may still have inbound links:

| Platform    | Years     | Address shape                                                                            |
| ----------- | --------- | ---------------------------------------------------------------------------------------- |
| Static HTML | 2012      | `/Our_Products.html`, `/Wedding_Cake_Info.html`, in mixed case                           |
| WordPress   | 2012–2016 | `/products/wondrous-wedding-cakes`, `/schedule-tasting`                                  |
| WordPress   | 2019–2023 | `/birthday-cakes`, paged as `/birthday-cakes/page/2`, and a blog of articles at the root |
| Next.js     | 2023–     | `/product/birthday-cakes`, `/policies-and-pricing`                                       |

`next.config.js` redirected the 2019–2023 site's category pages and three of its other pages; the rest of that site, and both earlier ones, have answered 404 since each was replaced.

## 2. Site origin

Absolute addresses are needed by the canonical link, the social card, the sitemap, `robots.txt`, and the structured data. They are built from `SITE_URL`, a server-only variable holding the origin with no trailing slash (`https://cakeelizabeth.com`). It is read from the environment and not from the request, so a request that reaches the server under another host name (a preview deploy, the host's own domain) still names the production address as canonical.

`SITE_URL` is added to the required variables of `scripts/validate-env.ts` ([005§3.1](../005-contact-form-email/SPEC.md#31-environment-check)), and to the prefixes `vite.config.ts` copies to `process.env`. In development `.env.local` sets it to `http://localhost:5173`, the dev server's address, so the head can be checked locally, and the `production-build` configuration of `.claude/launch.json` ([§7](#7-production-server)) sets it to that server's own port.

A build fixes the origin into the server: `vite.config.ts` defines `process.env.SITE_URL` as the value it finds while building, so the built server reads the build's origin wherever it runs, and `SITE_URL` is needed where the site is built and not where it runs. The dev server reads it from the environment as before. A host that knows its production origin under a name of its own gives it to the build in its own configuration, and not in the code: `vercel.json`'s build command sets `SITE_URL` to `https://` followed by Vercel's `VERCEL_PROJECT_PRODUCTION_URL`, the shortest of the project's production domains, which is the apex. A preview build is given the production origin too.

The browser renders the head too, after hydration and on every navigation inside the app, and needs the same origin. A `VITE_` variable would carry it there only by fixing it into the bundle at build time, so `src/lib/siteUrl.ts` exposes the variable through a server function, `getSiteUrl`, wrapped in a router query. It is read once at the root of the app, so its value is serialized into the page with the rest of the server's data and is not asked for again on a navigation.

The origin is the third value the whole site shares, after the constants ([000§7.3](../000-initial/SPEC.md#73-constants)) and the navigation ([002§2.2](../002-design-v2-header-footer/SPEC.md#22-navigation-model)), and each had a provider of its own at the root. They become one: `SiteWideProvider`, in `src/primitives/SiteWideContext.tsx`, takes the place of `ConstantsProvider` and `NavigationProvider` in `src/app.tsx`, reads the constants and the navigation with `createCmsContent` as they were read before, so both still follow live preview, and reads the origin with `getSiteUrl`. `useSiteWide` takes the names of the accessors a component needs, any of `constants`, `navigation`, `seo`, and `siteUrl`, and returns them as a tuple in that order (`const [constants, siteUrl] = useSiteWide("constants", "siteUrl")`), in place of `useConstants` and `useNavigation`, and the module also takes over `navigationSource` and the `Constants` and `Navigation` types. `src/primitives/ConstantsContext.tsx` and `src/primitives/NavigationContext.tsx` are removed. A value that belongs to the whole site and not to one page is added to this provider rather than given a provider of its own. The routes of [§4](#4-crawling-and-indexing), which run only on the server, read it with `readSiteUrl`.

A server built, or in development started, without `SITE_URL` still renders. The head leaves out every tag that needs an absolute address (the canonical link, `og:url`, and `og:image` with its alt text), the home page leaves out its structured data, `robots.txt` disallows everything, and `sitemap.xml` answers 503.

The site has one host. Which one, apex or `www`, and the redirects from the other and from `http`, are the host's to apply, because they happen before a request reaches the server. The site deploys to Vercel. The live site answers on the apex over `https`, and `http://` and `www.` both answer 308 to it ([§7](#8-tasks) T1); the new host keeps the apex and those two redirects. _Awaits deployment:_ check that `http://cakeelizabeth.com` and `https://www.cakeelizabeth.com` each answer a permanent redirect to `https://cakeelizabeth.com` in one hop, and that a page's canonical address names `https://cakeelizabeth.com`, which shows that the build was given `SITE_URL`.

## 3. Document head

### 3.1 Content fields

A description, a search title, and a share image are read by people in search results and in link previews, so they come from the CMS ([GAC§1](../GLOBAL_ACCEPTANCE_CRITERIA.md)). The canonical address, the robots directives, and the sitemap are not perceived by anyone and are built in code.

The page collection ([000§6.6](../000-initial/SPEC.md#66-collections)) gains an `seo` object, every field optional ([000§6.3](../000-initial/SPEC.md#63-everything-is-optional-at-the-collection-root)):

| Field         | Holds                                                  | When empty                      |
| ------------- | ------------------------------------------------------ | ------------------------------- |
| `title`       | The title for search results and the tab               | The page's `title`              |
| `description` | The meta description and the social card's description | The SEO entry's `defaultDescription` |
| `image` | The social card's image | The SEO entry's `defaultImage` |
| `imageAlt` | The alt text of `image` | none |
| `noindex`     | Keeps the page out of the index and the sitemap        | The page is indexed             |

An image and its alt text are taken as a pair: a page with an `image` of its own uses its own `imageAlt`, and a page without one uses both of the SEO entry's. The alt text is a field because it is perceived, by assistive technology reading a link preview ([GAC§1](../GLOBAL_ACCEPTANCE_CRITERIA.md)). The `seo` object is built with `fields.object`, every field in it with `required: false`, and `noindex` defaults to false.

The search title is a field apart from the page's `title` because the page's name in the admin and its tab ("Gallery") is rarely the phrase a page should rank for ("Custom Cake Gallery"). The previous site kept the two apart for the same reason, and its `metadata.title` and `metadata.description` values are the starting content of the new fields.

Search results show about 60 characters of a title and 160 of a description and cut the rest, so the fields are limited to fit:

| Field | Limit | Why |
| --- | --- | --- |
| A page's `seo.title` | 43 characters | 60 less the 17 of " \| Cake Elizabeth", which the title template adds |
| A page's `seo.description` | 160 characters | What a result shows |
| The SEO entry's `defaultDescription` | 160 characters | The same, for a page that has no description |

The limit is a `maxLength` option of `fields.string` and `fields.text` ([000§6.1](../000-initial/SPEC.md#61-field-builders)), which `src/lib/cms/define.ts` gains so that the admin and the build enforce one number. It adds `.max(maxLength)` to the field's Zod schema, so `validate:content` fails a build whose content breaks it, and a Decap `pattern` of `^[\s\S]{0,maxLength}$` with the message "maxLength characters or fewer", so the admin refuses to save an entry that breaks it and says why beside the field. The title's limit is tied to the template as it is written; a template made longer or shorter leaves the limit where it was. A page's `title`, the page's name in the admin and the fallback for an empty search title, is not limited.

What applies to the whole site is held by a content type of its own, `seo` in `src/models/Seo.shape.ts`, exported as `SeoShape` and added to `collectionRegistry` ([000§6.6](../000-initial/SPEC.md#66-collections)). It is a singleton as the constants and the navigation are: `create: false`, the identifier `name`, no `previewPath`, and one entry at `public/content/seo/main.md`. Its values are kept apart from the constants, which hold the strings of controls drawn across the site ([000§7.3](../000-initial/SPEC.md#73-constants)), so that an editor finds everything search engines and link previews read in one place, and changes the default share image there without a change to the code.

| Field | Holds | Initial content |
| --- | --- | --- |
| `name` | The entry's name in the admin | "SEO" |
| `titleTemplate` | The document title, with the token `{title}` standing for the page's title | "{title} \| Cake Elizabeth" (the field's default) |
| `defaultDescription` | The description of a page that has none | none |
| `defaultImage` | The social card image of a page that has none | `/images/homehero.jpg` |
| `defaultImageAlt` | The alt text of `defaultImage` | A description of the photo |
| `areaServed` | The area named in the structured data ([§3.5](#35-structured-data)) | "Southern Maine" |
| `profiles` | A list of addresses of the business's profiles elsewhere | The Instagram and Facebook addresses the previous site linked |
| `address` | The street address in the structured data, an object of `streetAddress`, `addressLocality`, `addressRegion`, `postalCode`, and `addressCountry` | 851 Sawyer St, South Portland, ME 04106, US, as the previous site's contact page gave it |

`SiteWideProvider` ([§2](#2-site-origin)) reads the entry with `createCmsContent` beside the constants and the navigation, so the head follows live preview of it too, and `useSiteWide` hands it out as `seo`.

The title template replaces [006§2](../006-not-found-page/SPEC.md#2-content-type)'s decision that titles carry no site name: the site name in a result's title is what a person searching for the studio by name looks for, and the previous site carried it. It applies to every document title, the not-found view's included, so a tab reads the same everywhere. A template rather than a suffix field is chosen so that the separator and the order are written by an editor and not split between a field and the code. Its token is written as the sent panel's are, a name in single braces ([005§5.2](../005-contact-form-email/SPEC.md#52-sent)), so that an editor meets one convention across the admin; the double braces of `{{slug}}` belong to Decap's own configuration and not to content. The template is filled by the panel's replacement, which moves out of `ContactFormSentPanel.tsx` into `src/lib/utils/fillTokens.ts` now that it has two users. A template with no `{title}` in it is ignored and the page's title is used alone, so that a template typed without the token does not give every page the same title.

### 3.2 `SeoMarkup`

Everything a page puts in its head, and its structured data, is rendered by one component, `SeoMarkup` in `src/components/seo/SeoMarkup.tsx`, through `@solidjs/meta`. The page route renders it in place of its `<Title>`, and `NotFound` in place of its own, so each view renders its SEO markup once. It takes the page's title, its `seo` object, and its path, and renders:

- the `<title>` from the template;
- `<meta name="description">`, when there is a description;
- `<link rel="canonical">` ([§3.3](#33-canonical-address));
- `<meta name="robots" content="noindex">`, when the page has `noindex`;
- the social card ([§3.4](#34-social-card));
- the structured data, when the path is the home page's ([§3.5](#35-structured-data)).

`NotFound` passes no canonical and no description: it answers with a 404 ([006§3](../006-not-found-page/SPEC.md#3-the-view)), which already keeps it out of the index, and a canonical on it would name an address that has no page. It does so by passing no path: without one, `SeoMarkup` renders no canonical link, no `og:url`, and no description, the SEO entry's included. A page's path comes from `getPagePath` in `src/models/Page.shape.ts`, which the collection's `previewPath` and the sitemap use as well.

Both callers render `SeoMarkup` inside a `<Show>` on their content, the page route inside the one that already waits for the page and `NotFound` inside one on its entry, so that it is created only once the content has loaded. The head is written after every fragment has completed and outside any `<Suspense>`, and a tag created while its content was pending would read that content again then; if the fetch had failed, the read throws where nothing catches it and the response never ends.

Each tag with a condition is rendered under a keyed `<Show>`, so that it receives its value and not an accessor. A tag whose value goes away, such as the gallery card's description when a modal closes, is then unmounted with the value it had, and does not read an accessor that no longer holds one, which Solid reports as an error.

The head follows live preview as the page does ([GAC§4](../GLOBAL_ACCEPTANCE_CRITERIA.md)), so an editor sees the tab title change while typing. Nothing in the head is a click-to-edit target, because nothing in it is drawn on the page.

### 3.3 Canonical address

A page's canonical address is `SITE_URL` followed by its path with no query: `/` for the home page ([001§3.8](../001-design-v2-modules/SPEC.md#38-home-page)) and `/` and the slug for every other.

The query is dropped because the site's query parameters are view state ([GAC§7](../GLOBAL_ACCEPTANCE_CRITERIA.md)): `galleryFilterTag` filters the gallery and `modal` opens an item over it ([000§15.1](../000-initial/SPEC.md#151-routing)). Both render on the server, so without a canonical each tag and each item would be crawled as a page of its own, all with the gallery's title and description. They consolidate on the page that holds them.

### 3.4 Social card

`SeoMarkup` renders the Open Graph and Twitter tags a link preview reads: `og:type` `website`, `og:site_name` from the constants' `siteName`, `og:title`, `og:description`, `og:url` (the canonical address), `og:image` with its alt text, `og:locale` `en_US`, and `twitter:card` `summary_large_image`. Image addresses are made absolute with `SITE_URL`.

A gallery modal address is the one place the card differs from its page. The modal is made to be shared ([000§15.1](../000-initial/SPEC.md#151-routing)), and a shared link to one cake that previews as the gallery's card shows the wrong picture. When the request carries a `modal` parameter that names a gallery item, the card's image, title, and description are that item's `image`, `title`, and `description`, and the canonical address is still the page's ([§3.3](#33-canonical-address)). The item is found in the gallery items the page has already read, so the card adds no fetch: `SeoMarkup` asks for them through the same query, under the collection's name and with no arguments, as the gallery module and the modal do. It asks only when a `modal` parameter is present.

### 3.5 Structured data

The home page carries one JSON-LD block describing the business as a `Bakery`, the schema.org type of `LocalBusiness` that fits a cake studio. It is built from the constants and the SEO entry: `name` from the constants' `siteName`, `url` from `SITE_URL`, `logo` from the constants' `logo`, `telephone` and `email` from their `phone` and `email`, `areaServed` from the SEO entry's `areaServed`, `sameAs` from its `profiles`, and `address` as a `PostalAddress` from its `address`. A field with no value is left out of the block, and so is an `address` with no `streetAddress`, whatever its other fields hold, since `addressCountry` has a default.

The studio publishes the street address the previous site's contact page gave, so the block carries it ([§8](#8-tasks) T6). An editor who empties the address leaves the business described by the area it serves alone.

It is on the home page only, because that is the page that stands for the business; repeating it on every page adds nothing a search engine uses. `SeoMarkup` renders it, through a component of its own in the same file, when its path is the home page's, `/`. `@solidjs/meta` has no script tag, so the block is a `<script type="application/ld+json">` in the body, which search engines read as they do one in the head. Every `<` in the JSON is written as `\u003c`, so that a value cannot close the script.

### 3.6 Rendering the head on the server

On the server a `<Suspense>` boundary renders its subtree again each time a resource inside it settles, until none is pending, and disposes the pass it replaces. `@solidjs/meta`'s server provider adds a tag on every pass and ignores the disposal. The head kept the tags of every discarded pass: a page's canonical link twice, and the not-found view's tags from the pass in which the page's entry had not loaded yet and the route rendered its not-found fallback.

`HeadProvider`, in `src/components/seo/HeadProvider.tsx` beside `SeoMarkup`, takes `MetaProvider`'s place in `src/app.tsx`. In the browser it renders `MetaProvider`. On the server it provides `MetaContext` with a store of its own, which removes a tag when its pass is disposed, keeps one `<title>`, and writes the rest into the head as the library does. The server store sits inside a component of its own, `ServerHeadProvider`, one level deep as `MetaProvider` is, because every component advances Solid's hydration key: a server tree one component shallower than the browser's left every key below it unmatched, and hydration failed.

A `<Suspense>` inside a pass that is discarded still completes once its own resources settle, and renders into the disposed pass, where nothing removes its tags. So nothing that renders head tags has a boundary of its own: `SeoMarkup` suspends the page's boundary. The gallery card's fetch ([§3.4](#34-social-card)) is read through the resource's `latest` value, which waits for it on the server and not in the browser, so that opening a modal does not hold the navigation's transition, and with it the modal's view transition, on that fetch.

## 4. Crawling and indexing

### 4.1 `robots.txt`

`robots.txt` is served by a route, `src/routes/robots.txt.ts`, and not as a file in `public/`, because what it says depends on the host. When the request's host (name and port) is `SITE_URL`'s, it allows everything except `/admin/` and `/api/`, and names the sitemap's absolute address. On any other host it disallows everything, so a preview deploy or the host's own domain is not indexed beside the real one. _Awaits deployment:_ request `https://cakeelizabeth.com/robots.txt` and see it allow the site and name `https://cakeelizabeth.com/sitemap.xml`, and request `robots.txt` on the host's own domain and see it disallow everything.

### 4.2 Sitemap

`sitemap.xml` is served by `src/routes/sitemap.xml.ts`. It lists the canonical address of every page entry ([§3.3](#33-canonical-address)), read through `getCollection` ([GAC§5](../GLOBAL_ACCEPTANCE_CRITERIA.md)), except pages with `noindex` and the reserved slug ([006§5](../006-not-found-page/SPEC.md#5-reserved-address)). The `home` entry is listed as `/`, and the addresses are sorted so that the file does not change with the order the manifest lists entries in.

It gives no `lastmod`. Content files carry no modification date, and a date taken from the build or the file system would change on every deploy; search engines discount a `lastmod` that is not accurate. It gives no `priority` or `changefreq`, which the major search engines ignore. Gallery images are not listed as image entries: they are found as `<img>` elements on the gallery's pages once a crawler has rendered them, since the gallery draws them in the browser and not in its server markup.

### 4.3 Kept out of the index

| What                      | How                                                                                                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/admin/` | Disallowed in `robots.txt`, and an `X-Robots-Tag: noindex` header added by a Nitro route rule on `/admin/**`, because a disallowed address can still be indexed from a link to it. The rule is build-only, with the admin's other rules, since in development the admin is served by its own Vite server through a proxy |
| `/api/`                   | Disallowed in `robots.txt`                                                                                                                                         |
| A not-found address       | The 404 status ([006§3](../006-not-found-page/SPEC.md#3-the-view))                                                                                                 |
| A page with `noindex`     | The robots meta tag and its absence from the sitemap                                                                                                               |
| Any host but `SITE_URL`'s | `robots.txt` ([§4.1](#41-robotstxt)), and the canonical address naming the production host ([§2](#2-site-origin))                                                  |

The header on `/admin/` is added by the built server, and a host that serves the files of `public/` itself, ahead of the server, may send them without it. _Awaits deployment:_ check that `https://cakeelizabeth.com/admin/index.html` answers with `X-Robots-Tag: noindex`.

## 5. Redirects

### 5.1 Where they live

The redirect table is `src/lib/redirects.ts`, a list of `{ from, to }` entries with no imports, so that `vite.config.ts` can read it. The config turns each entry into a Nitro route rule, `redirect: { to, status: 301 }` (Nitro 3 names the code `status`), applied in development as well as in a build so that the table can be checked locally. The admin's existing route rules stay build-only ([000§5](../000-initial/SPEC.md#5-build)).

The table is code and not a CMS collection. A redirect is not perceived by anyone, it has to be in place before the server answers, and the rules it must keep ([§5.2](#52-rules)) are checked at build time. A page's slug is fixed when the page is created and does not follow later edits to its title, so the editor-driven case a collection would serve, renaming a page, does not arise.

The table is written as one object keyed by target, each holding the list of sources that redirect to it, and `redirectAll` flattens it into the exported list of `{ from, to }` entries. A gallery target is written through one helper, `galleryFilteredBy`, so that a tag is encoded as the filter parameter is. The table also exports `REDIRECT_STATUS`, which the trailing-slash middleware ([§5.3](#53-normalization)) answers with as well.

### 5.2 Rules

- **Permanent.** Every redirect answers 301. The previous site answered 307 for `/weddings`, which tells a search engine to keep the old address; nothing here is temporary.
- **One hop.** A redirect's target is a final address, never the source of another redirect. The previous site's legacy redirects pointed at addresses that this spec redirects again (`/cake-pricing` → `/policies-and-pricing`), and each is rewritten to point where the chain ends.
- **No shadowing.** A redirect's source is never the address of a page entry, which the redirect would hide.
- **A target that answers.** A target is the path of a page entry, with or without a query, or a file under `public/`.
- **Wildcards.** A source ending in `/**` matches everything under it, and a target ending in `/**` receives the rest of the path, as Nitro's route rules do.
- **Query.** Nitro carries the request's query onto the target, merged with the target's own. The previous product pages' `carouselIndex` therefore arrives on the gallery beside the tag and is ignored there.

A script, `scripts/validate-redirects.ts`, run as `validate:redirects`, checks the table against the content: that every source is a path and is listed once, that no source, wildcards included, matches the address of a page entry, that no target's path is matched by a source, and that every target's path is a page entry's address or a file under `public/` (a path ending in `/` stands for its `index.html`). It runs in `prebuild` after `validate:content`, once the admin build has written `public/admin/`. It fails the build on any violation, as the content check does ([000§5](../000-initial/SPEC.md#5-build)).

### 5.3 Normalization

| Request                                                                   | Answer                                 |
| ------------------------------------------------------------------------- | -------------------------------------- |
| A path with a trailing slash, other than `/` and anything under `/admin/` | 301 to the path without it, query kept |
| A path with an empty segment (`//`), other than anything under `/admin/` | 301 to the path with each run of slashes made one, query kept |
| `/home`                                                                   | 301 to `/`, query kept                 |

The trailing slash is removed by a request middleware in `src/middleware.ts`, registered with `solidStart({ middleware })`, because a route rule matches fixed paths and this applies to all of them. Repeated slashes at the end are removed together, so `/about//` answers in one hop, and so are runs of slashes inside a path: the router matches no route for a path with an empty segment and rendered an empty page with 200, which a search engine reads as a page that exists. `/draft/enable//contact`, an address of the previous site's editor preview that the Wayback Machine captured, therefore answers 301 to `/draft/enable/contact` and that answers 404, as [§5.5](#55-left-to-answer-404) leaves `/draft/**`. Both are done in one hop by one function, `normalizePath` in `src/lib/normalizePath.ts`, which [§8](#8-tasks) T9's check shares. `/home` is a route rule. The page route's `<Navigate>` for the `home` slug ([001§3.8](../001-design-v2-modules/SPEC.md#38-home-page)) stays for navigations inside the app, which never reach the server; on the server the rule answers first, so a crawler sees a 301 and not the `Navigate`'s 302.

Case is not normalized. The only mixed-case addresses the site has published are the 2012 static site's ([§1](#1-source-behavior)), and each has an entry of its own in its published case ([§5.4](#54-redirect-table)).

### 5.4 Redirect table

The table is drawn from every address [§7](#8-tasks) T1 and T2 found that the new site answers with a 404 (T4). Each target follows T5's order: the page that now holds the old page's content, then the gallery filtered to its subject, then the nearest page. An address that is not here is listed in [§5.5](#55-left-to-answer-404) or still answers on the new site: `/`, `/contact`, `/flavors`, and `/weddings`.

A gallery target with a tag uses the filter parameter, JSON-encoded as every query parameter is ([000§16](../000-initial/SPEC.md#16-shared-utilities)): `/gallery?galleryFilterTag=%22Birthday%22`. Its canonical address is `/gallery` ([§3.3](#33-canonical-address)), so the filtered address is where a visitor lands and not something that is indexed.

| From                                                                                                                                                     | To                               | Basis                                                                                                     |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `/about-us`, `/about-us/page/**`, `/About_Us.html`                                                                                                       | `/about`                         | Renamed                                                                                                   |
| `/about-website`                                                                                                                                         | `/about`                         | The note about the Next.js site; the nearest page                                                         |
| `/policies-and-pricing`, `/cake-pricing`, `/order-policies`, `/delivery-and-order-policies`                                                              | `/contact`                       | No page holds the policies or prices; the contact page's steps carry the quote, the deposit, and delivery |
| `/schedule-your-tasting`, `/schedule-tasting`, `/products/schedule-tasting`                                                                              | `/contact`                       | A tasting is booked by a request                                                                          |
| `/5-tips-successfully-ordering-custom-cake`                                                                                                              | `/contact`                       | An article on ordering; ordering starts on the contact page                                               |
| `/contact/page/**`, `/Contact_Us.html`, `/Location.html`                                                                                                 | `/contact`                       | The contact page's paged and earlier addresses                                                            |
| `/cake-pricing-flavors`, `/cake-pricing-flavors/page/**`, `/cake-flavors`                                                                                | `/flavors`                       | The 2019–2023 flavor page, which the Next.js site's own content still linked to, and its legacy redirect  |
| `/product/weddings`, `/weddings/page/**`, `/products/wondrous-wedding-cakes`, `/wondrous-wedding-cakes`, `/Wedding_Cake_Info.html`                       | `/weddings`                      | Wedding product pages                                                                                     |
| `/the-history-of-wedding-cakes`, `/things-to-consider-when-choosing-the-perfect-wedding-cake`, `/things-consider-choosing-perfect-wedding-cake`          | `/weddings`                      | The blogs' wedding articles                                                                               |
| `/product/birthday-cakes`, `/birthday-cakes`, `/birthday-cakes/page/**`, `/products/brilliant-birthday-cakes`, `/Birthdays.html`                         | `/gallery`, tag Birthday         | Product page → gallery filter                                                                             |
| `/product/childrens-cake`, `/childrens-cake`, `/childrens-cake/page/**`                                                                                  | `/gallery`, tag Children         | Same                                                                                                      |
| `/product/shower-cakes`, `/shower-cakes`, `/shower-cakes/page/**`, `/products/bridal-and-baby-shower-creations`, `/Showers.html`                         | `/gallery`, tag Shower           | Same                                                                                                      |
| `/product/special-occasion-cakes`, `/special-occasion-cakes`, `/special-occasion-cakes/page/**`, `/products/sweet-16-cakes`                              | `/gallery`, tag Special Occasion | Same                                                                                                      |
| `/product/religious-cakes`, `/religious-cakes`, `/religious-cakes/page/**`, `/products/religious-revelations`, `/Religious.html`                         | `/gallery`, tag Religious        | Same                                                                                                      |
| `/product/holiday-cakes`, `/holiday-cakes`, `/holiday-cakes/page/**`, `/products/holliday-cakes`                                                         | `/gallery`, tag Holiday          | Same                                                                                                      |
| `/product/cupcakes`, `/cupcakes`, `/cupcakes/page/**`, `/products/cutest-cupcakes-creations`, `/Cupcakes.html`                                           | `/gallery`, tag Cupcakes         | Same                                                                                                      |
| `/product/cake-pops-cookies`, `/cake-pops-cookies`, `/cake-pops-cookies/page/**`                                                                         | `/gallery`, tag Cake Pops        | Same; the product held both tags, and Cake Pops comes first in its name                                   |
| `/sculpted-cakes`, `/sculpted-cakes/page/**`                                                                                                             | `/gallery`, tag Sculpted         | The 2019–2023 site's most-captured page after the home page, which `next.config.js` missed                |
| `/product/naughty-cakes`, `/naughty-cakes`, `/naughty-cakes/page/**`, `/products/naughty-cakes`, `/products/devilish-divorce-cakes`                      | `/gallery`                       | Product pages with no matching tag                                                                        |
| `/dessert-bars`, `/dessert-bars/page/**`, `/dessert-bar`, `/products/tantalizing-tortes`, `/products/gumpaste-decorations`, `/Gumpaste_Decorations.html` | `/gallery`                       | Same                                                                                                      |
| `/products`, `/Our_Products.html`                                                                                                                        | `/gallery`                       | The product indexes                                                                                       |
| `/index.html`                                                                                                                                            | `/`                              | The static site's home page                                                                               |
| `/favicon.png`                                                                                                                                           | `/favicon.ico`                   | Renamed                                                                                                   |
| `/preview` | `/admin/index.html` | Was the editor's shortcut; the admin's page itself, because `/admin/` is redirected again by the admin's route rule in a build |

### 5.5 Left to answer 404

| Addresses                                                                                                                        | Why there is no target                                                                                                                                                                                                                                                                       |
| -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/draft/**`                                                                                                                      | The Next.js site's preview toggles for editors                                                                                                                                                                                                                                               |
| `/classes-2`                                                                                                                     | Decorating classes; no page of the site offers them                                                                                                                                                                                                                                          |
| `/blog`, `/category/**`, `/tag/**`, `/author/**`, `/2012/**`, `/page/**`                                                         | The blogs' indexes and archives. The site has no blog, and search engines treat a redirect of them all to the home page as a 404 anyway                                                                                                                                                      |
| `/our-process`, `/test-post`, `/product`                                                                                         | Already answered 404 on the site that published them                                                                                                                                                                                                                                         |
| `/wp-content`, `/wp-content/**`, `/resources/**`, `/photocrati_ajax`, `/scripts/blank.html`                                      | Images and files of the earlier sites, each captured once or twice. The Next.js site's first images, `/resources/pages/<category>/<n>.jpg`, have counterparts named `/images/<category>-<n>.jpg`, but a route rule cannot rename the path that way, and they have not been served since 2023 |
| `/sitemap-0.xml`, `/page-sitemap.xml`, `/feed.xml`, `/feeds/all.atom.xml`, `/atom.xml`, `/index.xml`, `/ads.txt`, `/app-ads.txt` | Files for machines; the sitemap is submitted again at its new address ([§7](#8-tasks))                                                                                                                                                                                                       |
| Images at `assets.tina.io`                                                                                                       | The live site's images are served from TinaCMS's CDN, which this server does not answer for. The same pictures are found at `/images/` through the new pages                                                                                                                                 |

## 6. Page experience

Search ranking reads how a page loads, and the decisions it depends on are recorded here:

- **One `h1` per page.** A page's `h1` comes from the content of its first module, written as Markdown ([001§3.7](../001-design-v2-modules/SPEC.md#37-real-pages-replace-the-test-page)), so nothing in the code guarantees one. T7 checks every page; a page without one, or with two, is corrected in its content.
- **The first image loads first.** A hero image is the largest thing in the first view, so it is loaded eagerly with `fetchpriority="high"`; gallery images below the first view are loaded lazily.
- **Images keep their space.** An image is given its width and height, or an aspect ratio, so the page does not shift when it arrives.
- **Alt text.** Gallery images take their item's `title` as alt text, as they do now. The hero's and the general module's images stay decorative (`alt=""`): their meaning is carried by the text beside them.
- **Favicon.** A search result shows the site's icon only when it is at least 48 by 48 pixels. `public/favicon.ico` is the previous site's icon, the mint cake of `public/favicon.png` on `main`, written as one ICO holding it at 16, 32, 48, and 256 pixels, each stored as PNG. It replaces the starter's 16-pixel icon, and `src/entry-server.tsx` links it as before. The previous site's `themeColor` is not carried over.

## 7. Production server

The redirects are route rules of the built server ([§5.1](#51-where-they-live)), so they can only be checked against a build. At the snapshot the build answered 500 to every request, and it is fixed here.

The server Nitro 2 builds hands each request to SolidStart's handler through an entry that `@solidjs/vite-plugin-nitro-2` generates, which wraps the handler with `fromWebHandler` imported from `h3`. Nitro 2 runs on h3 1, and SolidStart 2 on h3 2, which npm hoists to the project root because `@solidjs/start` depends on it directly. The generated entry is resolved from the root, so it took h3 2's `fromWebHandler`. That adapter passes on the event's `req`, which in h3 2 is a web `Request` and in h3 1 is Node's request, whose URL is only the path, and SolidStart failed to parse it before any route ran. The dev server is unaffected because it does not go through Nitro.

`vite.config.ts` adds a Rollup plugin to Nitro's build through its `rollup:before` hook. It resolves `h3` for the generated entry alone to the copy beside `nitropack`, which is h3 1, and it goes first among Nitro's plugins so it is asked before Nitro's own resolution. Every other import of `h3` keeps its version. The plugin's latest release, 0.3.2, generates the same entry, so upgrading it would not fix the build; the rule can go when a release imports the adapter from Nitro's h3 itself.

`.claude/launch.json` has a `production-build` configuration that serves `.output/` on port 3100 with mail turned off, for checking a build locally.

## 8. Tasks

These are performed by Claude, in order, before the redirect table and the open values above are final. Each writes what it finds into `specs/007-seo/crawl/` and then into this spec: the folder holds the raw lists, and the spec holds the decisions taken from them.

- **T1 — crawl the live site.** Fetch `robots.txt` and `sitemap.xml` from the live host, then crawl from `/`, following every internal link and every image, without running scripts. For each address record the status, the redirect target, the title, the meta description, the canonical address, the `h1`, and the images it links. Record which host and scheme the site settles on, and what `http://`, `www.`, and the apex each answer. Output: `crawl/live.csv`.
  - _Done 2026-10-15._ The site is on Vercel and settles on `https://cakeelizabeth.com`; `http://` and `www.` answer 308 to it. `robots.txt` allows everything, and `sitemap.xml` is an index of one child, `sitemap-0.xml`, listing the 16 pages. Every page names its own canonical. The home and contact pages have no `h1`. Each product page answers 200 to a `carouselIndex` query for each of its images. The naughty-cakes page links to `/cake-pricing-flavors`, which answers 404. Images are served from `assets.tina.io`, outside the crawl.
- **T2 — collect the historical addresses.** Query the Wayback Machine's CDX API for every address captured under the domain (`url=cakeelizabeth.com/*`, collapsed by URL key) and under `www.`. This finds the addresses of the platforms before the Next.js site, of which `next.config.js` holds only the ones that were remembered. Drop captures of assets that no longer matter (scripts and styles of the old builds), keep pages and images. Output: `crawl/wayback.csv`.
  - _Done 2026-10-15._ 999 addresses were captured; 204 remain once scripts, styles, fonts, and WordPress internals are dropped: 131 pages, 69 images, and 4 other files. They come from the four platforms of [§1](#1-source-behavior). `html_captures` is the page's capture count across both hosts.
- **T3 — merge with search data, if provided.** If the owner exports Google Search Console's pages report and top linked pages, merge them with T1 and T2 so that each address carries its clicks, impressions, and inbound links. Without the export, T2's capture count stands in for an address's weight.
  - _Not provided as of 2026-10-15._ The capture count was used. If an export arrives, an address it shows with clicks or links that [§5.5](#55-left-to-answer-404) leaves to 404 is reconsidered.
- **T4 — check the new site against the list.** Run a production build locally and request every address from T1–T3. Record what each answers. Output: `crawl/new-site.csv`.
  - _Done 2026-10-15._ It was first run against the dev server, because the production build answered 500 to every request, and again against the build once that was fixed ([§7](#7-production-server)); the two agree. Of 232 addresses, `/`, `/contact`, `/flavors`, `/weddings`, `/favicon.ico`, and `/admin` answer; the other 226 answer 404.
- **T5 — estimate the redirects.** For each address that answers 404 in T4 and has weight in T1–T3, choose a target by what the old page held: the page that now holds that content, then the gallery filtered to its subject, then the nearest page. Replace the table of [§5.4](#54-redirect-table) with the result, with a basis for each row, and decide `/policies-and-pricing`. An address with no sensible target is listed under a heading of its own and left to answer 404, which is better than a redirect to the home page that search engines treat as a 404 anyway.
  - _Done 2026-10-15._ [§5.4](#54-redirect-table) and [§5.5](#55-left-to-answer-404). `/policies-and-pricing` goes to `/contact`: the new site has no page of policies or prices, and the contact page's steps are the nearest content.
- **T6 — gather the business details.** From T1's pages and the old content on `main`, collect the studio's area served, its profiles (the previous site's navigation linked Facebook and Instagram), and whether it publishes an address. Write them into the constants ([§3.1](#31-content-fields)), and the previous site's `metadata` values into each page's `seo` object.
  - _Done 2026-10-20._ The values are in the SEO entry ([§3.1](#31-content-fields)), on the owner's answers: the published address on Sawyer St, "Southern Maine" as the area served, both profiles, and `/images/homehero.jpg` as the default share image. Each page's `seo` holds the previous site's `metadata` title and description, with the home page taking the previous home page's, About the about-us page's, Contact the contact page's, Flavors the flavor page's, and Weddings the weddings product page's. The previous site had no gallery page, so the gallery's title and description were written new.
- **T7 — audit the new pages.** For every page, check one `h1`, a description, a title within what a result shows, and a social card; check the gallery modal's card with a modal address. Correct what is missing in the content.
  - _Done 2026-10-20._ Every page has one `h1`, a canonical address, and a full social card, and the modal address carries its item's card. The home page's description (253 characters) and the weddings page's (163) ran past what a result shows; each was shortened, in the owner's choice of wording, and the limits of [§3.1](#31-content-fields) keep them there.
- **T8 — validate.** Validate the structured data with schema.org's validator and Google's Rich Results Test, the social card with a card preview, and run Lighthouse's SEO and performance audits on each page at both widths. Check the favicon ([§6](#6-page-experience)).
  - _Done 2026-10-20, apart from what needs the live host._ schema.org's validator reports no errors and no warnings for the home page's block, checked with `https://cakeelizabeth.com` as its origin. Lighthouse's SEO audit scores 100 on every page at both widths. Its performance audit scores 56 on every page at the mobile width and 66–82 at the desktop width, for the reasons kept as a known gap. The favicon is replaced ([§6](#6-page-experience)). Google's Rich Results Test and a card preview read a public address, so they are left for when the site is live.
  - _Awaits deployment:_ run Google's Rich Results Test on `https://cakeelizabeth.com/`, check the social card of a page and of a gallery modal address in a card preview, and run Lighthouse again on the live site, where responses are compressed.
- **T9 — verify the redirects.** Write `scripts/check-redirects.ts`, which takes a base address and `crawl/` lists and asserts that every old address answers 301 in one hop to a target that answers 200, or answers 404 if it is listed as having no target. Run it against the local build, and against the production host once it is live.
  - _Done 2026-10-20 against the local build._ `npm run check:redirects -- <base address>` reads `crawl/new-site.csv` and sorts each address by the table and the content: redirected (301 in one hop, to the table's target with the request's query merged, and that target answers 200), served (a page or a file under `public/`, which answers 200), or missing (404, after at most the one hop of [§5.3](#53-normalization)). The script shares `matchesRedirectSource` and `findRedirect` with the table and `normalizePath` with the middleware, and `scripts/lib/siteAddresses.ts` with `validate:redirects`. Its first run found the soft 404 of empty segments and the second hop of `/preview`, both fixed; it now passes for all 232 addresses: 102 redirected, 6 served, and 124 missing. It is to be run against the production host once it is live.
  - _Awaits deployment:_ run `npm run check:redirects -- https://cakeelizabeth.com`.

What only the owner can do is recorded so that it is not mistaken for done: verifying the domain in Google Search Console and Bing Webmaster Tools, submitting `sitemap.xml` there after launch, providing the export T3 uses, and updating the website address on the studio's Google Business Profile and social profiles if the host changes. _Awaits deployment:_ submit `https://cakeelizabeth.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

## Known gaps

- **Pages are slow on a phone.** Lighthouse's mobile performance score is 56 on every page, and the largest paint of the home and About pages takes 35–42 seconds on its simulated phone connection ([§8](#8-tasks) T8). `/images/aboutus.png`, drawn on both, is 4.9 MB. The three fonts are TrueType files of 1.2 MB together, where WOFF2 would be about a third of that. One script chunk is 428 KB, about 290 KB of it unused on a first load. The local server sends nothing compressed, which a host does, so the scripts and styles weigh less in production than in the audit. Search ranking reads page speed, so this is SEO's concern too, but the fix is an image and font pipeline and code splitting, which belongs to a feature of its own.
- **A trailing slash on `/api/contact` is redirected.** The middleware answers `/api/contact/` with 301 as it does every path, and a client that follows it sends a `GET`. Nothing posts to that address.
- **The server head is a copy of the library's.** `HeadProvider` ([§3.6](#36-rendering-the-head-on-the-server)) writes tags as `@solidjs/meta` 0.29 does, and the browser claims them by the `data-sm` attribute the library expects. An upgrade that changes either is not followed by it.

## Accepted gaps

- **Gallery images are not in the server markup.** The gallery module ([000§14](../000-initial/SPEC.md#14-gallery-module)) starts with empty columns and fills them in an effect, which runs only in the browser. A crawler that does not run scripts finds no gallery image, and one that does finds them only after rendering the page. _Accepted 2026-10-20:_ the gallery is drawn in the browser by design, and its images are left to crawlers that render the page.
