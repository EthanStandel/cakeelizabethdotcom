import {
  ContactFormRequest,
  ContactFormResponseSchema,
} from "./contactFormValidation";

const CONTACT_ENDPOINT = "/api/contact";

export const submitContactForm = async (
  request: ContactFormRequest,
): Promise<boolean> => {
  try {
    const response = await fetch(CONTACT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!response.ok) return false;
    const answer = ContactFormResponseSchema.safeParse(await response.json());
    return answer.success && answer.data.sent;
  } catch {
    return false;
  }
};
