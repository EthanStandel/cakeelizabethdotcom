// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { ContactForm } from "../../models/ContactForm";
import Sleep from "../../utils/Sleep";
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

  await Sleep(3000);

  res.status(200).json({ status: "ok" });
};

export default endpoint;
