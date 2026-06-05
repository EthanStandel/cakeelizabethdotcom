import z from "zod";
import { fields } from "~/lib/cms/define";

export const GalleryModuleShape = {
  label: "Gallery",
  fields: {
    heading: fields.string({ label: "Heading" }),
  },
};

const GalleryModuleShapeObject = fields.object(GalleryModuleShape);

export type GalleryModuleType = z.infer<
  typeof GalleryModuleShapeObject._zodSchema
>;
