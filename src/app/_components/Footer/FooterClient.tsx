"use client";

import { PropsOf } from "../../../utils/PropsOf";
import { Footer } from "./Footer";

export const FooterClient = (props: PropsOf<typeof Footer>) => (
  <Footer {...props} />
);
