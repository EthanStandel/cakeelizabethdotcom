"use client";

import { PropsOf } from "../../../../utils/PropsOf";
import { AboutUsPage } from "./AboutUsPage";

export const AboutUsPageClient = (props: PropsOf<typeof AboutUsPage>) => (
  <AboutUsPage {...props} />
);
