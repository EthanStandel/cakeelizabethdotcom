import z from "zod";
import { fields } from "~/lib/cms/define";

export const ContactFormModuleShape = {
  label: "Contact Form",
  fields: {
    heading: fields.string({ label: "Heading", required: false }),
    name: fields.object({
      label: "Name input",
      fields: {
        label: fields.string({ label: "Label" }),
        requiredError: fields.string({ label: "Required error" }),
      },
    }),
    email: fields.object({
      label: "Email input",
      fields: {
        label: fields.string({ label: "Label" }),
        requiredError: fields.string({ label: "Required error" }),
        invalidError: fields.string({ label: "Invalid error" }),
      },
    }),
    phone: fields.object({
      label: "Phone input",
      fields: {
        label: fields.string({ label: "Label" }),
        optionalLabel: fields.string({ label: "Optional label" }),
        placeholder: fields.string({ label: "Placeholder" }),
        invalidError: fields.string({ label: "Invalid error" }),
      },
    }),
    description: fields.object({
      label: "Description input",
      fields: {
        label: fields.string({ label: "Label" }),
        placeholder: fields.text({ label: "Placeholder" }),
        hint: fields.text({ label: "Hint" }),
        requiredError: fields.string({ label: "Required error" }),
      },
    }),
    submitLabel: fields.string({ label: "Submit label" }),
    footnote: fields.markdown({ label: "Footnote", required: false }),
  },
};

const ContactFormModuleShapeObject = fields.object(ContactFormModuleShape);

export type ContactFormModuleType = z.infer<
  typeof ContactFormModuleShapeObject._zodSchema
>;
