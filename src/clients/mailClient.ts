import * as mailer from "@sendgrid/mail";
import template from "lodash/template";

import environment from "../environment";
import { ContactForm } from "../models/ContactForm";
import contactEmailTemplate from "../resources/contact-email-template.html";
import statusCode from "../utils/statusCode";

const emailBuilder = template(contactEmailTemplate);
mailer.setApiKey(environment.mail.apiKey);

const mailClient = {
  sendContactForm: async (form: ContactForm) => {
    try {
      const [response] = await mailer.send({
        from: environment.mail.from as string,
        to: environment.mail.target,
        // TODO: maybe export this string as a template to a content file
        subject: `${form.name} reached out via the contact form!`,
        html: emailBuilder(form),
      });

      if (statusCode.is2xx(response.statusCode)) {
        return true;
      } else {
        console.error("Mailer failed", response);
        return false;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  },
};

export default mailClient;
