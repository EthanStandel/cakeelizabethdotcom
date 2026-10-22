import z from "zod";
import { fields } from "~/lib/cms/define";

export const FlavorMenuModuleShape = {
  label: "Flavor Menu",
  fields: {
    heading: fields.string({ label: "Heading", required: false }),
    layout: fields.select({
      label: "Layout",
      options: ["stacked", "columns"],
      default: "stacked",
      required: false,
    }),
    footnote: fields.string({ label: "Footnote", required: false }),
  },
};

const FlavorMenuModuleShapeObject = fields.object(FlavorMenuModuleShape);

export type FlavorMenuModuleType = z.infer<
  typeof FlavorMenuModuleShapeObject._zodSchema
>;
