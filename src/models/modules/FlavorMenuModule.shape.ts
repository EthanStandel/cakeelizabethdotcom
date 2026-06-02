import z from "zod";
import { fields } from "~/lib/cms/define";

export const FlavorMenuModuleShape = {
  label: "Flavor Menu",
  fields: {
    heading: fields.string({ label: "Heading" }),
    footnote: fields.string({ label: "Footnote", required: false }),
  },
};

const FlavorMenuModuleShapeObject = fields.object(FlavorMenuModuleShape);

export type FlavorMenuModuleType = z.infer<
  typeof FlavorMenuModuleShapeObject._zodSchema
>;
