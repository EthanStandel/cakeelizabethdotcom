"use client";

import { useTina } from "tinacms/dist/react";
import { AboutThisWebsiteQuery } from "../../../../.tina/__generated__/types";
import { Markdown } from "../../../components/Markdown";
import { e } from "easy-tailwind";

export const AboutWebsitePageClient = ({
  query,
}: {
  query: Parameters<typeof useTina<AboutThisWebsiteQuery>>[0];
}) => {
  const { data } = useTina<AboutThisWebsiteQuery>(query);

  return (
    <div className={e("px-4 py-4 justify-center", { desktop: "px-28" })}>
      <h1 className="uppercase text-center text-4xl pb-4">
        {data.aboutThisWebsite.title}
      </h1>
      <Markdown>{data.aboutThisWebsite.body}</Markdown>
    </div>
  );
};
