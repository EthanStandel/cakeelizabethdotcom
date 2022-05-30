import {
  ComputedFields,
  defineDocumentType,
  makeSource,
} from "@contentlayer/source-files";

const computedFields: ComputedFields = {
  page: {
    type: "string",
    resolve: (doc) => doc._raw.sourceFileDir.replace("pages/", ""),
  },
};

const contentLayerConfig = makeSource({
  contentDirPath: "public/resources",
  documentTypes: [
    defineDocumentType(() => ({
      name: "PageContent",
      filePathPattern: "pages/**/content.mdx",
      fields: {
        pageTitle: { type: "string", required: true },
        description: { type: "string", required: true },
        product: { type: "boolean", required: false },
        data: { type: "json" },
      },
      computedFields,
    })),
    defineDocumentType(() => ({
      name: "ExtendedPageContent",
      filePathPattern: "pages/**/extended-content.mdx",
      fields: {},
      computedFields,
    })),
    defineDocumentType(() => ({
      name: "ImageManifest",
      filePathPattern: "**/imageManifest.json",
      fields: {
        items: { type: "list", of: { type: "string" }, required: true },
      },
      computedFields,
    })),
  ],
});

export default contentLayerConfig;
