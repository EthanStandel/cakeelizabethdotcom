import type { APIEvent } from "@solidjs/start/server";
import {
  ContactFormRequestSchema,
  ContactFormResponse,
} from "~/modules/ContactFormModule/contactFormValidation";
import { sendContactFormEmail } from "~/modules/ContactFormModule/sendContactFormEmail";

const JSON_CONTENT_TYPE = "application/json";

const UNSUPPORTED_MEDIA_TYPE = 415;
const BAD_REQUEST = 400;

const isJsonRequest = (request: Request) =>
  request.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase() ===
  JSON_CONTENT_TYPE;

const readJson = (request: Request): Promise<unknown> =>
  request.json().catch(() => undefined);

export const POST = async ({ request }: APIEvent) => {
  if (!isJsonRequest(request)) {
    return new Response(null, { status: UNSUPPORTED_MEDIA_TYPE });
  }
  const body = ContactFormRequestSchema.safeParse(await readJson(request));
  if (!body.success) return new Response(null, { status: BAD_REQUEST });
  const response: ContactFormResponse = {
    sent: await sendContactFormEmail(body.data),
  };
  return Response.json(response);
};
