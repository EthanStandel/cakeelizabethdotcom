import * as yup from "yup";

import { ContactForm } from "../models/ContactForm";

const schema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  phoneNumber: yup
    .string()
    .test("valid-phone-number", "Invalid phone number", (value) => {
      if (!value) {
        return true;
      }

      return value.split("").filter((char) => char.match(/\d/)).length === 10;
    }),
  subject: yup.string(),
  message: yup.string().required(),
});

const contactFormValidator = {
  schema,
  validate: (form: ContactForm) => schema.isValidSync(form),
};

export default contactFormValidator;
