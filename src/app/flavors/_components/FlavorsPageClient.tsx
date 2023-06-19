"use client";

import { useTina } from "tinacms/dist/react";
import { FlavorPageQuery } from "../../../../.tina/__generated__/types";
import { Markdown } from "../../../components/Markdown";
import { FlavorGroupCard } from "./FlavorGroupCard";

export const FlavorsPageClient = ({
  query,
}: {
  query: Parameters<typeof useTina<FlavorPageQuery>>[0];
}) => {
  const { data } = useTina<FlavorPageQuery>(query);

  return (
    <div className="px-4 desktop:px-28 py-4 justify-center">
      <div className="desktop:grid desktop:grid-cols-2 flex flex-col gap-4 items-center py-4">
        <div>
          <h1 className="uppercase text-center text-4xl pb-4">
            {data.flavorPage.title}
          </h1>
          <Markdown>{data.flavorPage.body}</Markdown>
          <FlavorGroupCard {...data.flavorPage.flavorGroups[0]} />
        </div>
        <img className="rounded" src={data.flavorPage.heroImage} />
      </div>
      <div className="desktop:grid desktop:grid-cols-2 flex flex-col gap-4 items-center py-4">
        {data.flavorPage.flavorGroups.slice(1).map((group, index) => (
          <FlavorGroupCard key={index} {...group} />
        ))}
      </div>
    </div>
  );
};
