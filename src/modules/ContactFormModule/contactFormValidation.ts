import z from "zod";

export const CONTACT_FORM_KEYS = [
  "name",
  "email",
  "phone",
  "description",
] as const;

export type ContactFormKey = (typeof CONTACT_FORM_KEYS)[number];

export type ContactFormErrorField = "requiredError" | "invalidError";

export type ContactFormErrors = Partial<
  Record<ContactFormKey, ContactFormErrorField>
>;

const REQUIRED_ERROR: ContactFormErrorField = "requiredError";
const INVALID_ERROR: ContactFormErrorField = "invalidError";

const US_PHONE_DIGIT_COUNT = 10;
const US_COUNTRY_CODE = "1";

const isUsPhoneNumber = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, "");
  return (
    digits.length === US_PHONE_DIGIT_COUNT ||
    (digits.length === US_PHONE_DIGIT_COUNT + US_COUNTRY_CODE.length &&
      digits.startsWith(US_COUNTRY_CODE))
  );
};

const requiredText = z.string().trim().min(1, REQUIRED_ERROR);

export const ContactFormValuesSchema = z.object({
  name: requiredText,
  email: requiredText.pipe(
    z.email({ pattern: z.regexes.unicodeEmail, error: INVALID_ERROR }),
  ),
  phone: z
    .string()
    .trim()
    .refine((phone) => phone === "" || isUsPhoneNumber(phone), INVALID_ERROR),
  description: requiredText,
} satisfies Record<ContactFormKey, z.ZodType<string>>);

export type ContactFormValues = z.infer<typeof ContactFormValuesSchema>;

// HONEYPOT, NOT A REAL FIELD. Nothing is collected as "priceRange": the name only looks like something the form might ask, so that a program filling in every input fills this one too. No visitor can see or reach its input (ContactFormHoneypot), and the server drops any request that has a value in it (sendContactFormEmail).
export const HONEYPOT_KEY = "priceRange";

export const ContactFormRequestSchema = z.strictObject({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  description: z.string(),
  [HONEYPOT_KEY]: z.string(),
});

export type ContactFormRequest = z.infer<typeof ContactFormRequestSchema>;

export const ContactFormResponseSchema = z.object({ sent: z.boolean() });

export type ContactFormResponse = z.infer<typeof ContactFormResponseSchema>;

// Every message in ContactFormValuesSchema is a ContactFormErrorField, and an input's first issue is the one shown, so an empty email reads as required and not as invalid.
export const validateContactForm = (
  values: ContactFormValues,
): ContactFormErrors => {
  const result = ContactFormValuesSchema.safeParse(values);
  if (result.success) return {};
  const { fieldErrors } = z.flattenError(result.error);
  return Object.fromEntries(
    CONTACT_FORM_KEYS.flatMap((key) => {
      const [message] = fieldErrors[key] ?? [];
      return message ? [[key, message as ContactFormErrorField]] : [];
    }),
  );
};
