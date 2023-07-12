"use client";

import { useTina } from "tinacms/dist/react";
import { FlavorPageQuery } from "../../../../.tina/__generated__/types";
import { Markdown } from "../../../components/Markdown";
import { FlavorGroupCard } from "./FlavorGroupCard";
import { e } from "easy-tailwind";

export const FlavorsPageClient = ({
  query,
}: {
  query: Parameters<typeof useTina<FlavorPageQuery>>[0];
}) => {
  const { data } = useTina<FlavorPageQuery>(query);

  return (
    <div className={e("px-4 py-4 justify-center", { desktop: "px-28" })}>
      <div
        className={e("flex flex-col gap-4 items-center py-4", {
          desktop: "grid grid-cols-2",
        })}
      >
        <div>
          <h1 className="uppercase text-center text-4xl pb-4">
            {data.flavorPage.title}
          </h1>
          <Markdown>{data.flavorPage.body}</Markdown>
          <FlavorGroupCard {...data.flavorPage.flavorGroups[0]} />
        </div>
        <img className="rounded" src={data.flavorPage.heroImage} />
      </div>
      <div
        className={e("flex flex-col gap-4 items-center py-4", {
          desktop: "grid grid-cols-2",
        })}
      >
        {data.flavorPage.flavorGroups.slice(1).map((group, index) => (
          <FlavorGroupCard key={index} {...group} />
        ))}
      </div>
    </div>
  );
};
