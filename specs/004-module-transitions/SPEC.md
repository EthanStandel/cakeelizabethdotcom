# 004 — module transitions

| | |
| --- | --- |
| Status | Implemented |
| Depends on | [000](../000-initial/SPEC.md), [001](../001-design-v2-modules/SPEC.md), [002](../002-design-v2-header-footer/SPEC.md), [003](../003-universal-suffix-modules/SPEC.md) |
| Snapshot | 2026-10-12, commit `b8a3a9b3dbd9a6529e7584629dca4cf20be3d1b5` |

## Description

A page's modules arrive one by one, the way the links of the mobile menu do ([002§2.4](../002-design-v2-header-footer/SPEC.md#24-mobile-menu)). They do so on every page load and on every navigation inside the running app. On such a navigation the modules of the page being left go out first, and the modules of the new page come in only once those are gone. The header and the footer take no part: they belong to every page and stay where they are.

## 1. What moves

Each module at the top level of a page is one step of the sequence, and the universal suffix modules ([003§3](../003-universal-suffix-modules/SPEC.md#3-rendering)) are steps like any other, counted on from the page's own. A grid is one step, so its two cells move together. The not-found view has no modules and does not move.

A module is not told that it moves. The page route wraps each module in `ModuleTransition`, from `src/components/ModuleTransition/`, and the wrapper is what fades and travels, so a module added to the registry later ([000§13.1](../000-initial/SPEC.md#131-registry)) moves with no further change. `UniversalSuffixModules` wraps its modules the same way and takes the number of modules before them, `transitionIndexOffset`, from the route. The wrapper is a plain block with no padding or border of its own, so a module's margins collapse through it and the page is laid out as it was without it.

The wrapper stands between `<main>` and its modules, so the two rules of [003§3](../003-universal-suffix-modules/SPEC.md#3-rendering) that `<main>` holds for a page ending in a ruled hero now look one level further down: at the hero inside the last wrapper, where they looked at `<main>`'s last child.

## 2. The motion

The motion is the mobile menu's. A module fades in while it settles down into its place from `-translate-y-3` above it, and it leaves upwards to the same offset. Each module waits one step for each module before it. The step and the fade are the `--module-transition-stagger` and `--module-transition-fade` tokens in `src/app.css`, which are defined as the menu's `--navigation-link-stagger` and `--navigation-link-fade`, and the easing is the menu's `ease-in-out`. The two motions are therefore one until a value is written into the module tokens in place of the reference.

`ModuleTransition` gives its element the module's position, from which the delay is computed in CSS, as `NavigationLinks` does for a link.

## 3. Arriving on a page load

The modules are in the server markup in their settled state, and that state has a `@starting-style` of the hidden one, as an open menu's links have. The browser therefore plays the arrival itself when it first draws the page, and no script takes part ([GAC§6](../GLOBAL_ACCEPTANCE_CRITERIA.md)). A browser without `@starting-style` shows the modules at once.

The modules arrive from the top of the page down, whatever part of it is in the window.

## 4. Leaving and arriving on a navigation

`createModuleTransition`, in `createModuleTransition.ts`, holds the one piece of state: whether the modules are out. `ModuleTransitionProvider` creates it in the page route `src/routes/[[slug]].tsx` ([001§3.8](../001-design-v2-modules/SPEC.md#38-home-page)) and provides it to the wrappers. It sits above the part of the route that changes with the slug, so it lasts across every page, the `/home` redirect included.

### 4.1 Which navigations

Only a navigation that changes the URL's path plays the motion. Opening or closing the gallery modal, stepping through it, and changing the gallery's filter change the query string alone ([000§15.1](../000-initial/SPEC.md#151-routing)) and leave the modules where they are. So does a link to the page already shown.

A link followed inside the app plays both halves: the modules leave in turn ([§4.2](#42-leaving)) and the new ones arrive ([§4.3](#43-arriving)). The Back and Forward buttons play the arrival only ([§4.4](#44-back-and-forward)).

### 4.2 Leaving

The navigation is held until the modules are out. `createModuleTransition` registers with the router's `useBeforeLeave`, stops the navigation, marks the modules as out, waits for them, and then lets the router carry on. The address therefore changes when the modules are gone, and not at the click.

The modules leave from the last to the first, as the links of a closing menu do, but only the modules in the window take turns. A visitor at the top of a long page would otherwise wait a step for each module below the window before anything they can see began to move, and a navigation that is being held should not be held for motion nobody sees. Each wrapper registers its element, and at the moment of leaving the ones that overlap the window are numbered from the lowest up. The others leave at once, unseen.

The wait is on the wrappers' own running transitions, read from the elements, and not on a timer. No duration is mirrored into JavaScript ([GAC§10](../GLOBAL_ACCEPTANCE_CRITERIA.md)), and where no transition runs, the navigation is not held at all.

A second navigation started while the modules are leaving takes the place of the first: when the modules are out, the router carries on to the latest destination only. While the modules are out they take no clicks.

### 4.3 Arriving

The modules stay out while the router loads the new page, and what is hidden in the meantime is the old page, so no empty page is shown. When the router's `useIsRouting` reports that the navigation has ended, the modules are marked as in again and arrive as on a page load, from the top down. The router has scrolled to the top by then.

For that report to mean that the new page is drawn, the navigation has to wait for the page's content, and it did not. `createCmsContent` ([000§7.2](../000-initial/SPEC.md#72-primitives)) returned its store once the store held a page, without reading the fetch, so the router had nothing to wait for: it ended the navigation at once, changed the address and scrolled to the top with the old page still drawn, and the new content replaced it whenever its request returned. `createCmsContent` now reads the fetch on every read, so a navigation to another slug suspends until that slug's content has loaded, and the address, the scroll, the content, and the arrival all change together. The entries whose slug never changes, the constants, the navigation, and the suffix modules, are not affected.

A second fault in `createCmsContent` showed once the modules had an arrival to replay. Its first read returned the fetched object and every later one the store's proxy of it, so each list drawn from the content took its items for new ones when the store was filled and rebuilt them. On a page load that happened at hydration: every module, and every link of the header, was removed and created again, and the arrival started over from nothing partway through. The store now starts from the fetched value when that value is already there, as it is while hydrating, so the first read returns the proxy as well and nothing is rebuilt.

The arrival is a change of state and not a fresh `@starting-style`, because the wrappers outlive the navigation: the new page's content is reconciled into the old one's ([000§7.2](../000-initial/SPEC.md#72-primitives)), so a module's wrapper is reused for the module at the same position on the next page. A wrapper that the new page adds is created out and arrives with the rest.

### 4.4 Back and Forward

A Back or Forward navigation is not held. The router can only hold one by sending the browser back to the entry it had just left and repeating the step once the modules are out, and that round trip costs the destination its scroll position: the browser restores a position when it arrives at an entry, and what it finds stored after the round trip is the position of the page being left. The address would also change three times for one press of the button.

So the navigation goes ahead as it did before this feature, and the browser restores the scroll position. The modules are marked as out at the press and are not waited for. When the navigation ends, whatever is left of their leaving is finished at once, so the new page's modules start from fully out and arrive in turn.

The router reports such a navigation without a destination, but the browser has moved the address by then, so the destination's path is read from the window's location ([§4.1](#41-which-navigations)).

## 5. Reduced motion

A visitor who has asked their system for reduced motion gets none of this. The wrapper's transition is removed under `prefers-reduced-motion`, so modules are shown at once on a page load, and a navigation is not held, because there is no transition to wait for ([§4.2](#42-leaving)).

## Known gaps

- **A click before hydration plays no leaving.** Until the page has hydrated, a link is followed by the browser as a new page load, so the page being left is replaced at once and only the arrival plays ([§3](#3-arriving-on-a-page-load)). In development hydration takes from about half a second to well over a second after the page appears, which makes this easy to meet there; a production build hydrates sooner.
- **Back and Forward do not play the leaving.** The page being left is replaced as soon as the new one is ready ([§4.4](#44-back-and-forward)).
- **The arrival does not know where the window is.** The modules arrive from the top of the page down ([§3](#3-arriving-on-a-page-load)). When the browser restores a scroll position, on a reload or on Back and Forward, the modules in the window wait a step for each module above them.
- **The footer does not wait.** It keeps its place while the modules are out and moves to its new place at the moment the new page's modules are put in, before they have arrived.
- **A gallery that is reused may show through its arriving module.** Home and Weddings both hold a gallery at the same position, so a navigation between them reuses the module ([§4.3](#43-arriving)) and the gallery plays its filter animation ([000§14.4](../000-initial/SPEC.md#144-filter-animation)) while its wrapper arrives. A view transition draws a named element apart from its ancestors, and so without the wrapper's opacity, so the surviving items may be drawn in full for the length of that transition. This follows from how the two mechanisms work and has not been seen in a window: both galleries are below the window after such a navigation on the sizes checked.
