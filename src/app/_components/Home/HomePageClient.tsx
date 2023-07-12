"use client";

import Image from "next/image";
import { useTina } from "tinacms/dist/react";
import { HomePageDataQuery } from "../../../../.tina/__generated__/types";
import { CardLink } from "../../../components/CardLink";
import { Markdown } from "../../../components/Markdown";
import { QuoteCarousel } from "./_components/QuoteCarousel";
import { e } from "easy-tailwind";

export const HomePageClient = ({
  homePageQuery,
}: {
  homePageQuery: Parameters<typeof useTina<HomePageDataQuery>>[0];
}) => {
  const { data } = useTina<HomePageDataQuery>(homePageQuery);

  return (
    <>
      <img
        className="w-full max-h-80 object-cover"
        src={data.homePage.heroImage}
      />
      <div className={e("px-4", { desktop: "px-28" })}>
        <Markdown className="my-12">{data.homePage.body}</Markdown>
      </div>
      <ul
        className={e(
          "w-full px-4 grid gap-8 grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] justify-items-center",
          { desktop: "px-28 grid-cols-[repeat(auto-fill,minmax(24rem,1fr))]" }
        )}
      >
        {data.productConnection.edges
          .filter(({ node }) => !node.hidden)
          .map(({ node }) => (
            <li key={node._sys.filename} className="w-full! flex">
              <CardLink href={`/product/${node._sys.filename}`}>
                <Image
                  src={node.images[0].image}
                  width={400}
                  height={400}
                  alt={node.title}
                />
                <div className="p-3 flex flex-col items-center font-semibold gap-2">
                  {node.title}
                  <div className="w-full rounded-full font-bold bg-primary uppercase tracking-widerest py-4 flex justify-center items-center">
                    {data.homePage.cta}
                  </div>
                </div>
              </CardLink>
            </li>
          ))}
      </ul>
      <QuoteCarousel quotes={data.homePage.quotes} />
    </>
  );
};
