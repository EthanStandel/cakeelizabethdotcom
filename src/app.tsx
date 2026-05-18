import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, onMount } from "solid-js";
import type { CmsFieldFocusMessage } from "~/lib/cms/types";
import "./app.css";

function setupCmsPreview() {
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
    const message: CmsFieldFocusMessage = { type: "cms-field-focus", fieldName };
    try {
      (window.top ?? window.parent).postMessage(message, "*");
    } catch {
      window.parent.postMessage(message, "*");
    }
  });
}

export default function App() {
  onMount(setupCmsPreview);
  return (
    <Router
      root={props => (
        <MetaProvider>
          <Title>SolidStart - Basic</Title>
          <a href="/">Index</a>
          <a href="/about">About</a>
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
