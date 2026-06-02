import { dispatch, type CmsMessageMap } from "~/lib/cms/messages";

const dispatchToParent = <T extends keyof CmsMessageMap>(
  type: T,
  payload: CmsMessageMap[T]
) => {
  try {
    dispatch(window.top ?? window.parent, type, payload);
  } catch {
    dispatch(window.parent, type, payload);
  }
};

export const setupCmsPreview = () => {
  let inCms = false;
  try {
    inCms = window !== window.top;
  } catch {
    inCms = true;
  }
  if (!inCms) return;

  document.body.classList.add("cms-preview");

  const sendRouteChange = (source: "push" | "replace" | "pop") => {
    dispatchToParent("cms-route-change", {
      path: location.pathname + location.search + location.hash,
      source,
    });
  };

  window.addEventListener("popstate", () => sendRouteChange("pop"));

  const origPushState = history.pushState.bind(history);
  history.pushState = (...args) => {
    origPushState(...args);
    sendRouteChange("push");
  };

  const origReplaceState = history.replaceState.bind(history);
  history.replaceState = (...args) => {
    origReplaceState(...args);
    sendRouteChange("replace");
  };

  document.addEventListener("click", (e) => {
    e.preventDefault();
    const target = (e.target as Element).closest("[data-cms-field]");
    if (!target) return;
    const fieldPath = target.getAttribute("data-cms-field");
    if (!fieldPath) return;
    e.stopPropagation();
    dispatchToParent("cms-field-focus", {
      fieldPath,
      collection: target.getAttribute("data-cms-collection") ?? undefined,
      slug: target.getAttribute("data-cms-slug") ?? undefined,
    });
  });
};
