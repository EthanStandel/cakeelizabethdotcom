import CMS from "decap-cms-app";
import { collectionRegistry } from "../src/models";
import { buildIframePreviewComponent } from "./IframePreview";
import "./browser-patches";
import "./admin.css";
import "./navigateToField";

CMS.init({ config: { backend: { base_url: window.location.origin } } } as Parameters<typeof CMS.init>[0]);
collectionRegistry.forEach((collection) => {
  CMS.registerPreviewTemplate(
    collection.name,
    buildIframePreviewComponent({
      collection: collection.name,
      previewPath: collection.previewPath,
    })
  );
});
