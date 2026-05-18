import type { CmsFieldFocusMessage } from "~/lib/cms/types";

export const setupCmsPreview = () => {
  let inCms = false;
  try {
    inCms = window !== window.top;
  } catch {
    inCms = true;
  }
  if (!inCms) return;

  document.body.classList.add("cms-preview");
  document.addEventListener("click", (e) => {
    const target = (e.target as Element).closest("[data-cms-field]");
    if (!target) return;
    const fieldName = target.getAttribute("data-cms-field");
    if (!fieldName) return;
    e.stopPropagation();
    const message: CmsFieldFocusMessage = {
      type: "cms-field-focus",
      fieldName,
    };
    try {
      (window.top ?? window.parent).postMessage(message, "*");
    } catch {
      window.parent.postMessage(message, "*");
    }
  });
};
