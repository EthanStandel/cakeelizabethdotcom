import CMS from "decap-cms-app";
import { collectionRegistry } from "../src/models";
import { buildIframePreviewComponent } from "./IframePreview";
import "./browser-patches";
import "./admin.css";
import "./navigateToField";

CMS.init();
collectionRegistry.forEach((collection) => {
  CMS.registerPreviewTemplate(
    collection.name,
    buildIframePreviewComponent({ previewPath: collection.previewPath })
  );
});
