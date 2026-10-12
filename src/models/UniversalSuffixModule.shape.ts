import { defineCollection, fields } from "~/lib/cms/define";
import { ModuleRegistryShape } from "./ModuleRegistry.shape";
import { PageShape } from "./Page.shape";
import z from "zod";

export const UniversalSuffixModuleShape = defineCollection({
  name: "universal-suffix-module",
  label: "Universal Suffix Module",
  folder: "public/content/universal-suffix-module",
  create: false,
  identifierField: "name",
  previewPath: null,
  fields: {
    name: fields.string({ label: "Name" }),
    modules: fields.list({
      label: "Modules",
      types: ModuleRegistryShape,
      required: false,
    }),
    excludedSlugs: fields.relation({
      label: "Excluded Pages",
      collection: PageShape.name,
      searchFields: ["title"],
      valueField: "{{slug}}",
      displayFields: ["title"],
      multiple: true,
      required: false,
    }),
  },
});

export type UniversalSuffixModuleType = z.infer<
  typeof UniversalSuffixModuleShape.schema
>;
