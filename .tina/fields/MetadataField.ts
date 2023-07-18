import { TinaField } from "tinacms";

export const MetadataField: TinaField = {
  name: "metadata",
  label: "Metadata",
  type: "object",
  // @ts-ignore
  fields: [
    {
      type: "string",
      label: "Title",
      name: "title",
    },
    {
      type: "string",
      component: "textarea",
      label: "Description",
      name: "description",
    },
  ],
};
