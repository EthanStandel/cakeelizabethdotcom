import { createMessageHandler } from "~/lib/cms/messages";
import { localStorageKeys } from "./localStorageKeys";

function isItemCollapsed(item: Element): boolean {
  // The NestedObjectLabel (a div) sits between StyledListItemTopBar and
  // ObjectControl. Decap sets it display:block when collapsed, display:none
  // when expanded — so its visibility is the authoritative collapse signal.
  // Walk from the first button (the toggle) up to the TopBar (a direct child
  // of `item`), then take the next sibling = NestedObjectLabel.
  const toggleBtn = item.querySelector<HTMLButtonElement>("button");
  if (!toggleBtn) return false;
  let topBar: Element | null = toggleBtn.parentElement;
  while (topBar && topBar.parentElement !== item) {
    topBar = topBar.parentElement;
  }
  if (!topBar) return false;
  const nestedLabel = topBar.nextElementSibling as HTMLElement | null;
  if (!nestedLabel) return false;
  return getComputedStyle(nestedLabel).display !== "none";
}

async function expandItem(item: Element): Promise<void> {
  if (!isItemCollapsed(item)) return;
  const toggleBtn = item.querySelector<HTMLButtonElement>("button");
  if (!toggleBtn) return;
  toggleBtn.click();
  await new Promise<void>((resolve) => setTimeout(resolve, 300));
}

async function navigateToField(fieldPath: string): Promise<void> {
  const keys = fieldPath.split(".");
  let searchSpace: Element = document.documentElement;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const isLast = i === keys.length - 1;
    const isNumeric = /^\d+$/.test(key);

    if (isNumeric) {
      const n = parseInt(key, 10);
      const firstLabel = searchSpace.querySelector<HTMLLabelElement>("label");
      if (!firstLabel) return;

      // Ascend until we find a level where multiple siblings share the same
      // first-label text — that's the true list-items container, not some
      // intermediate field wrapper inside a single item.
      const labelText = firstLabel.textContent?.trim();
      let listContainer: Element | null = null;
      let candidate: Element | null = firstLabel.parentElement;
      while (candidate) {
        const parent = candidate.parentElement;
        if (!parent) break;
        const itemsWithSameFirstLabel = Array.from(parent.children).filter(
          (child) => child.querySelector("label")?.textContent?.trim() === labelText
        );
        if (itemsWithSameFirstLabel.length > 1) {
          listContainer = parent;
          break;
        }
        if (parent === searchSpace) break;
        candidate = parent;
      }
      // Fallback to the original 2-level heuristic (handles single-item lists)
      if (!listContainer) listContainer = firstLabel.parentElement?.parentElement ?? null;

      if (!listContainer) return;
      const nthItem = listContainer.children[n];
      if (!nthItem) return;
      await expandItem(nthItem);
      searchSpace = nthItem;
    } else {
      const labels = Array.from(
        searchSpace.querySelectorAll<HTMLLabelElement>("label")
      );
      const target = labels.find((el) => el.textContent?.includes(`[${key}]`));
      if (!target) return;

      if (isLast) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        const focusable =
          (target.htmlFor ? document.getElementById(target.htmlFor) : null) ??
          target.querySelector<HTMLElement>(
            "input, textarea, [contenteditable]"
          ) ??
          target.nextElementSibling?.querySelector<HTMLElement>(
            "input, textarea, [contenteditable]"
          ) ??
          target.parentElement?.nextElementSibling?.querySelector<HTMLElement>(
            "input:not([type=hidden]), textarea, [contenteditable]"
          );
        if (focusable) setTimeout(() => focusable.focus(), 500);
      } else {
        const container = target.htmlFor
          ? document.getElementById(target.htmlFor)
          : null;
        if (!container) return;
        searchSpace = container;
      }
    }
  }
}

// On startup: if a cross-collection transition was initiated, handle the
// pending field navigation and clear the flag.
{
  let isTransition = false;
  try {
    isTransition = JSON.parse(localStorage.getItem(localStorageKeys.fieldDocumentTransition) ?? "false") === true;
  } catch {}

  if (isTransition) {
    const cmsField = localStorage.getItem(localStorageKeys.cmsField);
    if (cmsField) {
      setTimeout(async () => {
        await navigateToField(cmsField);
        localStorage.setItem(localStorageKeys.fieldDocumentTransition, JSON.stringify(false));
      }, 1000);
    } else {
      localStorage.setItem(localStorageKeys.fieldDocumentTransition, JSON.stringify(false));
    }
  }
}

window.addEventListener(
  "message",
  createMessageHandler({
    "cms-field-focus": ({ fieldPath, collection, slug }) => {
      if (collection && slug) {
        const targetHash = `#/collections/${collection}/entries/${slug}`;
        if (window.location.hash !== targetHash) {
          localStorage.setItem(localStorageKeys.cmsField, fieldPath);
          localStorage.setItem(localStorageKeys.fieldDocumentTransition, JSON.stringify(true));
          window.location.hash = targetHash;
          window.location.reload();
          return;
        }
      }
      navigateToField(fieldPath);
    },
  })
);
