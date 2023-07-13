"use server";

import * as mailer from "@sendgrid/mail";
import { ContactEmail } from "../_components/ContactEmail";
import { PropsOf } from "../../../utils/PropsOf";

mailer.setApiKey(process.env.MAIL_API_KEY);

export const sendContactFormEmail = async (
  request: PropsOf<typeof ContactEmail>
) => {
  if (!validateRequest(request)) {
    return false;
  }

  if (process.env.NO_MAIL) return true;

  try {
    const [response] = await mailer.send({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TARGET,
      subject: `${request.fullName} reached out via the contact form!`,
      html: await renderContactEmail(request),
      replyTo: { name: request.fullName, email: request.email },
    });

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return true;
    } else {
      throw response;
    }
  } catch (response) {
    console.error("Mailer failed", response);
    return false;
  }
};

const validateRequest = (request: PropsOf<typeof ContactEmail>) =>
  !!request.fullName && !!request.email && !!request.message;

const renderContactEmail = async (request: PropsOf<typeof ContactEmail>) =>
  (await import("react-dom/server")) // next throws an error if you import "react-dom/server" normally
    .renderToString(<ContactEmail {...request} />);
