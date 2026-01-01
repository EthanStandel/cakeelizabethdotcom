import { TinaField } from "tinacms";

export const MetadataField: TinaField = {
  name: "metadata",
  label: "Metadata",
  type: "object",
  fields: [
    {
      type: "string",
      label: "Title",
      name: "title",
    },
    {
      type: "string",
      label: "Description",
      name: "description",
    },
  ],
};
