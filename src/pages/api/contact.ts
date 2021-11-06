// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import mailClient from "../../clients/mailClient";
import { ContactForm } from "../../models/ContactForm";
import contactFormValidator from "../../validation/contactFormValidator";

const endpoint = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  if (method !== "POST") {
    return res.status(404).json({ status: "not_found" });
  }

  const body: ContactForm = req.body;

  if (!contactFormValidator.validate(body)) {
    return res.status(400).json({ status: "bad_request" });
  }
  const mailSuccess = await mailClient.sendContactForm(body);
  if (mailSuccess) {
    return res.status(200).json({ status: "ok" });
  } else {
    return res.status(400).json({ status: "bad_request" });
  }
};

export default endpoint;
