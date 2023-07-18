"use client";

import { ContentData } from "../../../utils/content";
import { AboutUsPage } from "./AboutUsPage";

export const AboutUsPageClient = ({
  data,
}: {
  data: ContentData<"AboutUsPageCollection">;
}) => <AboutUsPage data={data} />;
