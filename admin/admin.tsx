import CMS from "decap-cms-app";
import { collectionRegistry } from "../src/models";
import { buildIframePreviewComponent } from "./IframePreview";
import "./browser-patches";
import type { CmsFieldFocusMessage } from "~/lib/cms/types";

function focusDecapField(label: string) {
  const labels = Array.from(document.querySelectorAll<HTMLLabelElement>("label"));
  const target = labels.find((el) => el.textContent?.trim() === label);
  if (!target) return;

  target.scrollIntoView({ behavior: "smooth", block: "center" });

  const focusable =
    (target.htmlFor ? document.getElementById(target.htmlFor) : null) ??
    target.querySelector<HTMLElement>("input, textarea, [contenteditable]") ??
    target.nextElementSibling?.querySelector<HTMLElement>("input, textarea, [contenteditable]") ??
    target.parentElement?.nextElementSibling?.querySelector<HTMLElement>("input:not([type=hidden]), textarea, [contenteditable]");

  if (focusable) setTimeout(() => focusable.focus(), 100);
}

window.addEventListener("message", (event: MessageEvent) => {
  if (event.data?.type !== "cms-field-focus") return;
  const { fieldName } = event.data as CmsFieldFocusMessage;
  for (const collection of collectionRegistry) {
    const field = collection.collectionConfig.fields.find((f) => f.name === fieldName);
    if (field) {
      focusDecapField(field.label);
      return;
    }
  }
});

CMS.init();
collectionRegistry.forEach((collection) => {
  CMS.registerPreviewTemplate(
    collection.name,
    buildIframePreviewComponent({ previewPath: collection.previewPath })
  );
});
