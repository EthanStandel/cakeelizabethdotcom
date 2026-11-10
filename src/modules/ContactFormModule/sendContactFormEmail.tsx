import mailer from "@sendgrid/mail";
import { NoHydration, renderToString } from "solid-js/web";
import { ContactEmail } from "./ContactEmail";
import {
  ContactFormRequest,
  ContactFormValues,
  ContactFormValuesSchema,
  HONEYPOT_KEY,
} from "./contactFormValidation";

const isNoMail = () => process.env.NO_MAIL === "true";

const noMailDelay = () => {
  const milliseconds = Number(process.env.NO_MAIL_DELAY);
  return Number.isFinite(milliseconds) && milliseconds > 0 ? milliseconds : 0;
};

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

const DOCTYPE = "<!DOCTYPE html>";

const renderContactEmail = (values: ContactFormValues) =>
  DOCTYPE +
  renderToString(() => (
    <NoHydration>
      <ContactEmail {...values} />
    </NoHydration>
  ));

// A failure that is not the provider's response can carry the request it was made with, and so the API key and the visitor's values, so only its message, code and response body are logged.
const loggableFailure = (failure: unknown) => {
  if (!(failure instanceof Error)) return failure;
  const { code, response } = failure as Error & {
    code?: unknown;
    response?: { body?: unknown };
  };
  return { message: failure.message, code, body: response?.body };
};

const isAccepted = (statusCode: number) =>
  statusCode >= 200 && statusCode < 300;

export const sendContactFormEmail = async (
  request: ContactFormRequest,
): Promise<boolean> => {
  if (request[HONEYPOT_KEY] !== "") return false;

  const parsed = ContactFormValuesSchema.safeParse(request);
  if (!parsed.success) return false;
  const values = parsed.data;

  if (isNoMail()) {
    await wait(noMailDelay());
    return true;
  }

  try {
    mailer.setApiKey(process.env.MAIL_API_KEY ?? "");
    const [response] = await mailer.send({
      from: process.env.MAIL_FROM ?? "",
      to: process.env.MAIL_TARGET,
      replyTo: { name: values.name, email: values.email },
      subject: `${values.name} reached out via the contact form!`,
      html: renderContactEmail(values),
    });
    if (!isAccepted(response.statusCode)) throw response;
    return true;
  } catch (failure) {
    console.error("Mailer failed", loggableFailure(failure));
    return false;
  }
};
