import z from "zod";
import { fields } from "~/lib/cms/define";

export const FlavorMenuModuleShape = {
  label: "Flavor Menu",
  fields: {
    heading: fields.string({ label: "Heading" }),
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
    footnote: fields.string({ label: "Footnote", required: false }),
  },
};

const FlavorMenuModuleShapeObject = fields.object(FlavorMenuModuleShape);

export type FlavorMenuModuleType = z.infer<
  typeof FlavorMenuModuleShapeObject._zodSchema
>;
