"use client";

import { PropsOf } from "../../../../utils/PropsOf";
import { AboutWebsitePage } from "./AboutWebsitePage";

export const AboutWebsitePageClient = (
  props: PropsOf<typeof AboutWebsitePage>
) => <AboutWebsitePage {...props} />;
