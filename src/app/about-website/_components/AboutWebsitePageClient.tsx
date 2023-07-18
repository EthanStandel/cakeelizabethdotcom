"use client";

import { Markdown } from "../../../components/Markdown";
import { e } from "easy-tailwind";
import { Content, useContentData } from "../../../utils/content";

export const AboutWebsitePageClient = ({
  content,
}: {
  content: Content<"AboutThisWebsitePageCollection">;
}) => {
  const data = useContentData(content);

  return (
    <div className={e("px-4 py-4 justify-center", { desktop: "px-28" })}>
      <h1 className="uppercase text-center text-4xl pb-4">{data.title}</h1>
      <Markdown>{data.body}</Markdown>
    </div>
  );
};
