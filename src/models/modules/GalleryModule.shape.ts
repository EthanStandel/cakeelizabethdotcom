import z from "zod";
import { fields } from "~/lib/cms/define";
import { TagsShape } from "../Tags.shape";

export const GalleryModuleShape = {
  label: "Gallery",
  fields: {
    heading: fields.string({ label: "Heading" }),
    tag: fields.select({
      label: "Preset tag",
      refOptions: { collection: TagsShape.name, field: "tags" },
      required: false,
    }),
  },
};

const GalleryModuleShapeObject = fields.object(GalleryModuleShape);

export type GalleryModuleType = z.infer<
  typeof GalleryModuleShapeObject._zodSchema
>;
