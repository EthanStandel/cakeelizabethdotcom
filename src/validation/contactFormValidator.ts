import * as yup from "yup";

import { ContactForm } from "../models/ContactForm";

const schema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  phoneNumber: yup.string(), // TODO - validate this
  subject: yup.string(),
  message: yup.string().required(),
});

const contactFormValidator = {
  schema,
  validate: (form: ContactForm) => schema.isValidSync(form),
};

export default contactFormValidator;
