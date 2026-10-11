export const CONTACT_FORM_KEYS = [
  "name",
  "email",
  "phone",
  "description",
] as const;

export type ContactFormKey = (typeof CONTACT_FORM_KEYS)[number];

export type ContactFormValues = Record<ContactFormKey, string>;

export type ContactFormErrorField = "requiredError" | "invalidError";

export type ContactFormErrors = Partial<
  Record<ContactFormKey, ContactFormErrorField>
>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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

export const validateContactForm = (
  values: ContactFormValues,
): ContactFormErrors => {
  const name = values.name.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();
  const description = values.description.trim();

  const errors: ContactFormErrors = {};
  if (!name) errors.name = "requiredError";
  if (!email) errors.email = "requiredError";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "invalidError";
  if (phone && !isUsPhoneNumber(phone)) errors.phone = "invalidError";
  if (!description) errors.description = "requiredError";
  return errors;
};
