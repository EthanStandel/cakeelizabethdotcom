import {
  ComputedFields,
  defineDocumentType,
  makeSource,
} from "@contentlayer/source-files";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeCodeTitles from "rehype-code-titles";
import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

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
      filePathPattern: "pages/**/content.md",
      bodyType: "mdx",
      fields: {
        pageTitle: { type: "string", required: true },
        description: { type: "string", required: true },
        data: { type: "json" },
      },
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
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      rehypeCodeTitles,
      rehypePrism,
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["anchor"],
          },
        },
      ],
    ],
  },
});

export default contentLayerConfig;
