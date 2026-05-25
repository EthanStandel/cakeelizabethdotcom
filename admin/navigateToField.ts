import type { CmsFieldFocusMessage } from "~/lib/cms/types";

function navigateToField(fieldPath: string): void {
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
      const firstItem = firstLabel.parentElement;
      if (!firstItem) return;
      const listContainer = firstItem.parentElement;
      if (!listContainer) return;
      const nthItem = listContainer.children[n];
      if (!nthItem) return;
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

window.addEventListener("message", (event: MessageEvent) => {
  if (event.data?.type !== "cms-field-focus") return;
  const { fieldPath } = event.data as CmsFieldFocusMessage;
  navigateToField(fieldPath);
});
