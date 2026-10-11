import z from "zod";
import { fields } from "~/lib/cms/define";

export const HorizontalListModuleShape = {
  label: "Horizontal List",
  fields: {
    heading: fields.string({ label: "Heading", required: false }),
    enumerate: fields.boolean({
      label: "Enumerate",
      default: false,
      required: false,
    }),
    items: fields.list({
      label: "Items",
      fields: {
        title: fields.string({ label: "Title" }),
        description: fields.text({ label: "Description" }),
      },
    }),
  },
};

const HorizontalListModuleShapeObject = fields.object(
  HorizontalListModuleShape,
);

export type HorizontalListModuleType = z.infer<
  typeof HorizontalListModuleShapeObject._zodSchema
>;
