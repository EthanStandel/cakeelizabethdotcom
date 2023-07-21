"use client";

import { PropsOf } from "../../../utils/PropsOf";
import { ContactUsPage } from "./ContactUsPage";

export const ContactUsPageClient = (props: PropsOf<typeof ContactUsPage>) => (
  <ContactUsPage {...props} />
);
