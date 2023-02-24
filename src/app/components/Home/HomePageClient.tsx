"use client";

import { useTina } from "tinacms/dist/react";
import { HomePageQuery } from "../../../../.tina/__generated__/types";
import { Markdown } from "../../../components/Markdown";

export const HomePageClient = ({
  homePageQuery,
}: {
  homePageQuery: Parameters<typeof useTina<HomePageQuery>>[0];
}) => {
  const { data } = useTina<HomePageQuery>(homePageQuery);
  return (
    <>
      <img
        className="w-full max-h-80 object-cover"
        src={data.homePage.heroImage}
      />
      <div className="px-4 desktop:px-28">
        <Markdown className="my-12">{data.homePage.body}</Markdown>
      </div>
    </>
  );
};
