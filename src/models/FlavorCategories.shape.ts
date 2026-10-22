import { defineCollection, fields } from "~/lib/cms/define";
import z from "zod";

export const FlavorCategoriesShape = defineCollection({
  name: "flavor-categories",
  label: "Flavor Categories",
  folder: "public/content/flavor-categories",
  create: false,
  identifierField: "name",
  previewPath: null,
  fields: {
    name: fields.string({ label: "Name" }),
    categories: fields.list({
      label: "Categories",
      fields: {
        name: fields.string({ label: "Category name" }),
        flavors: fields.list({
          label: "Flavors",
          fields: {
            name: fields.string({ label: "Name" }),
          },
        }),
      },
    }),
  },
});

export type FlavorCategoriesType = z.infer<typeof FlavorCategoriesShape.schema>;
