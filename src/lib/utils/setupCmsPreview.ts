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
    e.preventDefault();
    const target = (e.target as Element).closest("[data-cms-field]");
    if (!target) return;
    const fieldPath = target.getAttribute("data-cms-field");
    if (!fieldPath) return;
    e.stopPropagation();
    console.log("[cms-preview] click detected, fieldPath:", fieldPath);
    const message: CmsFieldFocusMessage = {
      type: "cms-field-focus",
      fieldPath,
    };
    try {
      (window.top ?? window.parent).postMessage(message, "*");
      console.log("[cms-preview] postMessage sent to window.top");
    } catch {
      window.parent.postMessage(message, "*");
      console.log("[cms-preview] postMessage sent to window.parent (fallback)");
    }
  });
};
